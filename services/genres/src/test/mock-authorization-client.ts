import type { IAuthorizationClient } from '@romulus/authorization/client'
import { okAsync } from 'neverthrow'
import { vi } from 'vitest'

export class MockAuthorizationClient implements IAuthorizationClient {
  createPermission = vi.fn<IAuthorizationClient['createPermission']>()
  ensurePermissions = vi.fn<IAuthorizationClient['ensurePermissions']>()
  deletePermission = vi.fn<IAuthorizationClient['deletePermission']>()
  createRole = vi.fn<IAuthorizationClient['createRole']>()
  deleteRole = vi.fn<IAuthorizationClient['deleteRole']>()
  assignRoleToUser = vi.fn<IAuthorizationClient['assignRoleToUser']>()
  checkMyPermission = vi
    .fn<IAuthorizationClient['checkMyPermission']>()
    .mockReturnValue(okAsync(true))
  getMyPermissions = vi.fn<IAuthorizationClient['getMyPermissions']>()
}
