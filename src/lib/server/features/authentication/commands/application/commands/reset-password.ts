import type { HashRepository } from '../../../../common/domain/repositories/hash'
import type { TokenGenerator } from '../../../../common/domain/token-generator'
import type { PasswordResetToken } from '../../domain/entities/password-reset-token'
import { Session } from '../../domain/entities/session'
import type { AccountRepository } from '../../domain/repositories/account'
import type { PasswordResetTokenRepository } from '../../domain/repositories/password-reset-token'
import type { SessionRepository } from '../../domain/repositories/session'
import { AccountNotFoundError } from '../errors/account-not-found'

export type ResetPasswordResult = {
  userAccount: {
    id: number
  }
  userSession: {
    token: string
    expiresAt: Date
  }
}

export class ResetPasswordCommand {
  constructor(
    private accountRepo: AccountRepository,
    private sessionRepo: SessionRepository,
    private passwordResetTokenRepo: PasswordResetTokenRepository,
    private passwordHashRepo: HashRepository,
    private sessionTokenHashRepo: HashRepository,
    private sessionTokenGenerator: TokenGenerator,
  ) {}

  async execute(
    passwordResetToken: PasswordResetToken,
    newPassword: string,
  ): Promise<ResetPasswordResult | AccountNotFoundError> {
    const account = await this.accountRepo.findById(passwordResetToken.accountId)
    if (!account) {
      return new AccountNotFoundError(passwordResetToken.accountId)
    }

    const updatedAccount = account.resetPassword(await this.passwordHashRepo.hash(newPassword))
    await this.accountRepo.update(passwordResetToken.accountId, updatedAccount)

    // Sign out the account everywhere
    await this.sessionRepo.deleteAllForAccount(passwordResetToken.accountId)

    await this.passwordResetTokenRepo.deleteByTokenHash(passwordResetToken.tokenHash)

    const token = this.sessionTokenGenerator.generate(20)

    const tokenHash = await this.sessionTokenHashRepo.hash(token)
    const session = new Session(
      account.id,
      tokenHash,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    )

    await this.sessionRepo.save(session)

    return {
      userAccount: { id: account.id },
      userSession: { token, expiresAt: session.expiresAt },
    }
  }
}
