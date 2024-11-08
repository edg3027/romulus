import type { HashRepository } from '../../common/domain/repositories/hash'
import type { TokenGenerator } from '../../common/domain/token-generator'
import { LoginCommand } from './application/commands/login'
import { LogoutCommand } from './application/commands/logout'
import { RegisterCommand } from './application/commands/register'
import { RequestPasswordResetCommand } from './application/commands/request-password-reset'
import { ResetPasswordCommand } from './application/commands/reset-password'
import {
  UpdateUserSettingsCommand,
  type UpdateUserSettingsInput,
} from './application/commands/update-user-settings'
import { ValidatePasswordResetTokenCommand } from './application/commands/validate-password-reset-token'
import { ValidateSessionCommand } from './application/commands/validate-session'
import type { PasswordResetToken } from './domain/entities/password-reset-token'
import type { AccountRepository } from './domain/repositories/account'
import type { PasswordResetTokenRepository } from './domain/repositories/password-reset-token'
import type { SessionRepository } from './domain/repositories/session'

export class AuthenticationCommandService {
  private loginCommand: LoginCommand
  private logoutCommand: LogoutCommand
  private registerCommand: RegisterCommand
  private requestPasswordResetCommand: RequestPasswordResetCommand
  private resetPasswordCommand: ResetPasswordCommand
  private updateUserSettingsCommand: UpdateUserSettingsCommand
  private validatePasswordResetTokenCommand: ValidatePasswordResetTokenCommand
  private validateSessionCommand: ValidateSessionCommand

  constructor(
    accountRepo: AccountRepository,
    sessionRepo: SessionRepository,
    passwordResetTokenRepo: PasswordResetTokenRepository,
    passwordHashRepo: HashRepository,
    passwordResetTokenHashRepo: HashRepository,
    passwordResetTokenGeneratorRepo: TokenGenerator,
    sessionTokenHashRepo: HashRepository,
    sessionTokenGenerator: TokenGenerator,
  ) {
    this.loginCommand = new LoginCommand(
      accountRepo,
      sessionRepo,
      passwordHashRepo,
      sessionTokenHashRepo,
      sessionTokenGenerator,
    )
    this.logoutCommand = new LogoutCommand(sessionRepo, sessionTokenHashRepo)
    this.registerCommand = new RegisterCommand(
      accountRepo,
      sessionRepo,
      passwordHashRepo,
      sessionTokenHashRepo,
      sessionTokenGenerator,
    )
    this.requestPasswordResetCommand = new RequestPasswordResetCommand(
      passwordResetTokenRepo,
      passwordResetTokenGeneratorRepo,
      passwordResetTokenHashRepo,
    )
    this.resetPasswordCommand = new ResetPasswordCommand(
      accountRepo,
      sessionRepo,
      passwordResetTokenRepo,
      passwordHashRepo,
      sessionTokenHashRepo,
      sessionTokenGenerator,
    )
    this.updateUserSettingsCommand = new UpdateUserSettingsCommand(accountRepo)
    this.validatePasswordResetTokenCommand = new ValidatePasswordResetTokenCommand(
      passwordResetTokenRepo,
      passwordResetTokenHashRepo,
    )
    this.validateSessionCommand = new ValidateSessionCommand(
      accountRepo,
      sessionRepo,
      sessionTokenHashRepo,
    )
  }

  login(username: string, password: string) {
    return this.loginCommand.execute(username, password)
  }

  logout(sessionToken: string) {
    return this.logoutCommand.execute(sessionToken)
  }

  register(username: string, password: string) {
    return this.registerCommand.execute(username, password)
  }

  requestPasswordReset(accountId: number) {
    return this.requestPasswordResetCommand.execute(accountId)
  }

  resetPassword(passwordResetToken: PasswordResetToken, newPassword: string) {
    return this.resetPasswordCommand.execute(passwordResetToken, newPassword)
  }

  updateUserSettings(accountId: number, settings: UpdateUserSettingsInput) {
    return this.updateUserSettingsCommand.execute(accountId, settings)
  }

  validatePasswordResetToken(verificationToken: string) {
    return this.validatePasswordResetTokenCommand.execute(verificationToken)
  }

  validateSession(sessionToken: string | undefined) {
    return this.validateSessionCommand.execute(sessionToken)
  }
}