import { expect } from 'vitest'

import type { IDrizzleConnection } from '$lib/server/db/connection'
import { AccountsDatabase } from '$lib/server/db/controllers/accounts'

import { test } from '../../../../../../vitest-setup'
import {
  CreateGenreCommand,
  type CreateGenreInput,
} from '../../commands/application/commands/create-genre'
import { DrizzleGenreHistoryRepository } from '../../commands/infrastructure/drizzle-genre-history-repository'
import { DrizzleGenreRepository } from '../../commands/infrastructure/drizzle-genre-repository'
import { DrizzleGenreTreeRepository } from '../../commands/infrastructure/drizzle-genre-tree-repository'
import { GetRandomGenreIdQuery } from './get-random-genre-id'

async function createGenre(
  data: CreateGenreInput,
  accountId: number,
  dbConnection: IDrizzleConnection,
) {
  const createGenreCommand = new CreateGenreCommand(
    new DrizzleGenreRepository(dbConnection),
    new DrizzleGenreTreeRepository(dbConnection),
    new DrizzleGenreHistoryRepository(dbConnection),
  )

  const genre = await createGenreCommand.execute(data, accountId)

  if (genre instanceof Error) {
    expect.fail(`Failed to create genre: ${genre.message}`)
  }

  return genre
}

function getTestGenre(data?: Partial<CreateGenreInput>): CreateGenreInput {
  return {
    name: 'Test',
    type: 'STYLE',
    nsfw: false,
    parents: new Set(),
    derivedFrom: new Set(),
    influences: new Set(),
    akas: {
      primary: [],
      secondary: [],
      tertiary: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  }
}

test('should return undefined when no genres exist', async ({ dbConnection }) => {
  const query = new GetRandomGenreIdQuery(dbConnection)
  const result = await query.execute()
  expect(result).toBeUndefined()
})

test('should return the only id when only one genre exists', async ({ dbConnection }) => {
  const accountId = new AccountsDatabase()
  const [account] = await accountId.insert([{ username: 'Test', password: 'Test' }], dbConnection)

  const genre = await createGenre(getTestGenre(), account.id, dbConnection)

  const query = new GetRandomGenreIdQuery(dbConnection)
  const result = await query.execute()
  expect(result).toEqual(genre.id)
})

test('should return a random id when multiple genres exist', async ({ dbConnection }) => {
  const accountId = new AccountsDatabase()
  const [account] = await accountId.insert([{ username: 'Test', password: 'Test' }], dbConnection)

  const genre1 = await createGenre(getTestGenre(), account.id, dbConnection)
  const genre2 = await createGenre(getTestGenre(), account.id, dbConnection)

  const query = new GetRandomGenreIdQuery(dbConnection)
  const result = await query.execute()
  expect([genre1.id, genre2.id]).toContain(result)
})
