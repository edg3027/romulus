import type { IAuthorizationApplication } from '@romulus/authorization'

import { UnauthorizedError } from '../../domain/errors/unauthorized'
import { AuthenticationPermission } from '../../domain/permissions'
import type { AccountRepository } from '../../domain/repositories/account'
import { AccountNotFoundError } from '../errors/account-not-found'

export class GetAccountCommand {
  constructor(
    private accountRepo: AccountRepository,
    private authorization: IAuthorizationApplication,
  ) {}

  async execute(
    requestorAccountId: number,
    accountId: number,
  ): Promise<
    | {
        id: number
        username: string
        genreRelevanceFilter: number
        showRelevanceTags: boolean
        showTypeTags: boolean
        showNsfw: boolean
        darkMode: boolean
      }
    | UnauthorizedError
    | AccountNotFoundError
  > {
    const hasPermission =
      requestorAccountId === accountId ||
      (await this.authorization.hasPermission(
        requestorAccountId,
        AuthenticationPermission.GetAccount,
      ))
    if (!hasPermission) return new UnauthorizedError()

    const account = await this.accountRepo.findById(accountId)
    if (!account) {
      return new AccountNotFoundError(accountId)
    }

    const accountOutput = {
      id: account.id,
      username: account.username,
      genreRelevanceFilter: account.genreRelevanceFilter,
      showRelevanceTags: account.showRelevanceTags,
      showTypeTags: account.showTypeTags,
      showNsfw: account.showNsfw,
      darkMode: account.darkMode,
    }

    return accountOutput
  }
}
