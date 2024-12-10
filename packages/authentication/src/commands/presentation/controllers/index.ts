import type { LogoutController } from './logout'
import type { RegisterController } from './register'
import type { RequestPasswordResetController } from './request-password-reset'
import type { ResetPasswordController } from './reset-password'

export class AuthenticationController {
  constructor(
    private logoutController: LogoutController,
    private registerController: RegisterController,
    private requestPasswordResetController: RequestPasswordResetController,
    private resetPasswordController: ResetPasswordController,
  ) {}

  logout(sessionToken: string) {
    return this.logoutController.handle(sessionToken)
  }

  register(username: string, password: string) {
    return this.registerController.handle(username, password)
  }

  requestPasswordReset(
    userAccount: {
      id: number
    },
    accountId: number,
  ) {
    return this.requestPasswordResetController.handle(userAccount, accountId)
  }

  resetPassword(passwordResetToken: string, newPassword: string) {
    return this.resetPasswordController.handle(passwordResetToken, newPassword)
  }
}
