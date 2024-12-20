import { describe, expect, test } from 'vitest'

import { PermissionNotFoundError, RoleNotFoundError } from '../domain/authorizer'
import { MemoryAuthorizerRepository } from '../infrastructure/memory-repository'
import { AuthorizationApplication } from '.'

describe('createPermission()', () => {
  test('should create a permission', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())

    const error = await service.createPermission('permission', undefined)

    expect(error).toBeUndefined()
  })
})

describe('deletePermission()', () => {
  test('should delete a permission', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())
    const r1 = await service.createPermission('permission', undefined)
    expect(r1).toBeUndefined()

    const error = await service.deletePermission('permission')

    expect(error).toBeUndefined()
  })

  test('should do nothing if the permission does not exist', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())

    const error = await service.deletePermission('permission')

    expect(error).toBeUndefined()
  })
})

describe('createRole()', () => {
  test('should create a role', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())

    const error = await service.createRole('role', new Set(), undefined)

    expect(error).toBeUndefined()
  })

  test('should create a role with a permission', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())
    const r1 = await service.createPermission('permission', undefined)
    expect(r1).toBeUndefined()

    const error = await service.createRole('role', new Set(['permission']), undefined)

    expect(error).toBeUndefined()
  })

  test('should error if the permission does not exist', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())

    const error = await service.createRole('role', new Set(['permission']), undefined)

    expect(error).toEqual(new PermissionNotFoundError('permission'))
  })
})

describe('deleteRole()', () => {
  test('should delete a role', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())
    const r = await service.createRole('role', new Set(), undefined)
    expect(r).toBeUndefined()

    const error = await service.deleteRole('role')

    expect(error).toBeUndefined()
  })

  test('should do nothing if the role does not exist', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())

    const error = await service.deleteRole('role')

    expect(error).toBeUndefined()
  })
})

describe('assignRoleToUser()', () => {
  test('should assign a role to a user', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())
    const r = await service.createRole('role', new Set(), undefined)
    expect(r).toBeUndefined()

    const error = await service.assignRoleToUser(1, 'role')

    expect(error).toBeUndefined()
  })

  test('should error if the role does not exist', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())

    const error = await service.assignRoleToUser(1, 'role')

    expect(error).toEqual(new RoleNotFoundError('role'))
  })
})

describe('hasPermission()', () => {
  test('should return true if the user has the permission', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())
    const r1 = await service.createPermission('permission', undefined)
    expect(r1).toBeUndefined()
    const r2 = await service.createRole('role', new Set(['permission']), undefined)
    expect(r2).toBeUndefined()
    const r3 = await service.assignRoleToUser(1, 'role')
    expect(r3).toBeUndefined()

    const hasPermission = await service.hasPermission(1, 'permission')

    expect(hasPermission).toBe(true)
  })

  test('should return false if the user does not have the permission', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())
    const r1 = await service.createPermission('permission', undefined)
    expect(r1).toBeUndefined()
    const r = await service.createRole('role', new Set(['permission']), undefined)
    expect(r).toBeUndefined()

    const hasPermission = await service.hasPermission(1, 'permission')

    expect(hasPermission).toBe(false)
  })

  test('should return false if the permission does not exist', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())

    const hasPermission = await service.hasPermission(1, 'permission')

    expect(hasPermission).toBe(false)
  })

  test('should return false if the permission was deleted', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())
    const r1 = await service.createPermission('permission', undefined)
    expect(r1).toBeUndefined()
    const r2 = await service.createRole('role', new Set(['permission']), undefined)
    expect(r2).toBeUndefined()
    const r3 = await service.assignRoleToUser(1, 'role')
    expect(r3).toBeUndefined()
    await service.deletePermission('permission')

    const hasPermission = await service.hasPermission(1, 'permission')

    expect(hasPermission).toBe(false)
  })

  test('should return false if the role containing the permission was deleted', async () => {
    const service = new AuthorizationApplication(new MemoryAuthorizerRepository())
    const r1 = await service.createPermission('permission', undefined)
    expect(r1).toBeUndefined()
    const r2 = await service.createRole('role', new Set(['permission']), undefined)
    expect(r2).toBeUndefined()
    const r3 = await service.assignRoleToUser(1, 'role')
    expect(r3).toBeUndefined()
    await service.deleteRole('role')

    const hasPermission = await service.hasPermission(1, 'permission')

    expect(hasPermission).toBe(false)
  })
})
