import { describe, expect } from 'vitest'

import type { IDrizzleConnection } from '$lib/server/db/connection'
import { Sha256HashRepository } from '$lib/server/features/common/infrastructure/repositories/hash/sha256-hash-repository'

import { test } from '../../../../../../../vitest-setup'
import { CryptoTokenGenerator } from '../../../../common/infrastructure/token/crypto-token-generator'
import { NewAccount } from '../../domain/entities/account'
import { Session } from '../../domain/entities/session'
import { NonUniqueUsernameError } from '../../domain/errors/non-unique-username'
import { DrizzleAccountRepository } from '../../infrastructure/account/drizzle-account-repository'
import { BcryptHashRepository } from '../../infrastructure/hash/bcrypt-hash-repository'
import { DrizzleSessionRepository } from '../../infrastructure/session/drizzle-session-repository'
import { ValidateSessionCommand } from './validate-session'

function setupCommand(options: { dbConnection: IDrizzleConnection }) {
  const accountRepo = new DrizzleAccountRepository(options.dbConnection)
  const sessionRepo = new DrizzleSessionRepository(options.dbConnection)
  const sessionTokenHashRepo = new Sha256HashRepository()
  const sessionTokenGenerator = new CryptoTokenGenerator()

  const validateSession = new ValidateSessionCommand(accountRepo, sessionRepo, sessionTokenHashRepo)

  async function createAccount(data: { username: string; password: string }) {
    const passwordHashRepo = new BcryptHashRepository()

    const account = await accountRepo.create(
      new NewAccount({
        username: data.username,
        passwordHash: await passwordHashRepo.hash(data.password),
      }),
    )

    if (account instanceof NonUniqueUsernameError) {
      expect.fail('Account creation failed due to non-unique username')
    }

    return account
  }

  async function createSession(accountId: number) {
    const token = sessionTokenGenerator.generate(20)

    const tokenHash = await sessionTokenHashRepo.hash(token)

    const session = new Session(
      accountId,
      tokenHash,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    )
    await sessionRepo.save(session)
    return { ...session, token }
  }

  return { validateSession, createAccount, createSession }
}

describe('validateSession', () => {
  test('should return undefined account and session when session is not found', async ({
    dbConnection,
  }) => {
    const { validateSession } = setupCommand({ dbConnection })

    const result = await validateSession.execute('non_existent_session_id')

    expect(result).toEqual({
      userAccount: undefined,
      userSession: undefined,
    })
  })

  test('should return account and session when session is valid and just extended', async ({
    dbConnection,
    withSystemTime,
  }) => {
    const { validateSession, createAccount, createSession } = setupCommand({ dbConnection })

    const account = await createAccount({ username: 'testuser', password: 'password123' })
    const session = await createSession(account.id)

    // 16 days in the future
    withSystemTime(new Date(Date.now() + 16 * 24 * 60 * 60 * 1000))

    const result = await validateSession.execute(session.token)

    expect(result).toEqual({
      userAccount: {
        id: account.id,
        username: 'testuser',
        permissions: new Set(),
        genreRelevanceFilter: 0,
        showRelevanceTags: false,
        showTypeTags: true,
        showNsfw: false,
        darkMode: true,
      },
      userSession: {
        status: 'refreshed',
        token: session.token,
        expiresAt: expect.any(Date) as Date,
      },
    })

    expect(result.userSession?.expiresAt.getTime()).toBeGreaterThan(session.expiresAt.getTime())
  })

  test('should return account and session when session is valid but not extended', async ({
    dbConnection,
  }) => {
    const { validateSession, createAccount, createSession } = setupCommand({ dbConnection })

    const account = await createAccount({ username: 'testuser', password: 'password123' })
    const session = await createSession(account.id)

    const result = await validateSession.execute(session.token)

    expect(result).toEqual({
      userAccount: {
        id: account.id,
        username: 'testuser',
        permissions: new Set(),
        genreRelevanceFilter: 0,
        showRelevanceTags: false,
        showTypeTags: true,
        showNsfw: false,
        darkMode: true,
      },
      userSession: {
        status: 'valid',
        expiresAt: session.expiresAt,
      },
    })
  })
})
