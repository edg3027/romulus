import { describe, expect } from 'vitest'

import { checkApiKey } from '$lib/server/api-keys'
import { AccountsDatabase } from '$lib/server/db/controllers/accounts'
import { ApiKeysDatabase } from '$lib/server/db/controllers/api-keys'
import { ApiService } from '$lib/server/features/api/application/api-service'
import { CreateApiKeyCommand } from '$lib/server/features/api/application/commands/create-api-key'
import { DrizzleApiKeyRepository } from '$lib/server/features/api/infrastructure/repositories/api-key/drizzle-api-key'
import { Sha256HashRepository } from '$lib/server/features/common/infrastructure/repositories/hash/sha256-hash-repository'

import { test } from '../../../../vitest-setup'
import { actions, load } from './+page.server'

describe('load', () => {
  test('should throw error if not logged in', async ({ dbConnection }) => {
    try {
      await load({ params: { id: '1' }, locals: { dbConnection, user: undefined } })
      expect.fail('should throw error')
    } catch (e) {
      expect(e).toEqual({ status: 401, body: { message: 'Unauthorized' } })
    }
  })

  test('should throw error if account is not the one currently logged in', async ({
    dbConnection,
  }) => {
    try {
      await load({ params: { id: '1' }, locals: { dbConnection, user: { id: 2 } } })
      expect.fail('should throw error')
    } catch (e) {
      expect(e).toEqual({ status: 403, body: { message: 'Unauthorized' } })
    }
  })

  test('should throw error if account id is not a number', async ({ dbConnection }) => {
    try {
      await load({ params: { id: 'test' }, locals: { dbConnection, user: { id: 1 } } })
      expect.fail('should throw error')
    } catch (e) {
      expect(e).toEqual({ status: 400, body: { message: 'Invalid account ID' } })
    }
  })

  test('should throw error if account does not exist', async ({ dbConnection }) => {
    try {
      await load({ params: { id: '1' }, locals: { dbConnection, user: { id: 1 } } })
      expect.fail('should throw error')
    } catch (e) {
      expect(e).toEqual({ status: 404, body: { message: 'Account not found' } })
    }
  })

  test("should return no account keys if there aren't any", async ({ dbConnection }) => {
    const accountsDb = new AccountsDatabase()
    await accountsDb.insert(
      [{ id: 1, username: 'test-user', password: 'test-password' }],
      dbConnection,
    )

    const result = await load({ params: { id: '1' }, locals: { dbConnection, user: { id: 1 } } })
    expect(result).toEqual({ keys: [] })
  })

  test('should return account keys', async ({ dbConnection }) => {
    const accountsDb = new AccountsDatabase()
    const [account1, account2] = await accountsDb.insert(
      [
        { id: 1, username: 'test-user-1', password: 'test-password-1' },
        { id: 2, username: 'test-user-2', password: 'test-password-2' },
      ],
      dbConnection,
    )

    const createApiKey = new CreateApiKeyCommand(new DrizzleApiKeyRepository(dbConnection))
    await createApiKey.execute('test-key-1', account1.id)
    await createApiKey.execute('test-key-2', account2.id)

    const result = await load({
      params: { id: account1.id.toString() },
      locals: { dbConnection, user: { id: account1.id } },
    })

    expect(result).toEqual({
      keys: [{ id: 1, name: 'test-key-1', createdAt: expect.any(Date) as Date }],
    })
  })

  test('should return account keys in descending order of creation date', async ({
    dbConnection,
  }) => {
    const accountsDb = new AccountsDatabase()
    const [account] = await accountsDb.insert(
      [{ username: 'test-user-1', password: 'test-password-1' }],
      dbConnection,
    )

    const createApiKey = new CreateApiKeyCommand(new DrizzleApiKeyRepository(dbConnection))
    await createApiKey.execute('test-key-1', account.id)
    await createApiKey.execute('test-key-2', account.id)

    const result = await load({
      params: { id: account.id.toString() },
      locals: { dbConnection, user: { id: account.id } },
    })

    expect(result).toEqual({
      keys: [
        expect.objectContaining({ name: 'test-key-2' }),
        expect.objectContaining({ name: 'test-key-1' }),
      ],
    })
  })
})

describe('create', () => {
  test('should throw error if not logged in', async ({ dbConnection }) => {
    try {
      await actions.create({
        params: { id: '1' },
        locals: {
          dbConnection,
          user: undefined,
          services: {
            api: new ApiService(
              new DrizzleApiKeyRepository(dbConnection),
              new Sha256HashRepository(),
            ),
          },
        },
        request: new Request('http://localhost'),
      })
      expect.fail('should throw error')
    } catch (e) {
      expect(e).toEqual({ status: 401, body: { message: 'Unauthorized' } })
    }
  })

  test('should throw error if account is not the one currently logged in', async ({
    dbConnection,
  }) => {
    try {
      await actions.create({
        params: { id: '1' },
        locals: {
          dbConnection,
          user: { id: 2 },
          services: {
            api: new ApiService(
              new DrizzleApiKeyRepository(dbConnection),
              new Sha256HashRepository(),
            ),
          },
        },
        request: new Request('http://localhost'),
      })
      expect.fail('should throw error')
    } catch (e) {
      expect(e).toEqual({ status: 403, body: { message: 'Unauthorized' } })
    }
  })

  test('should throw error if account id is not a number', async ({ dbConnection }) => {
    try {
      await actions.create({
        params: { id: 'test' },
        locals: {
          dbConnection,
          user: { id: 1 },
          services: {
            api: new ApiService(
              new DrizzleApiKeyRepository(dbConnection),
              new Sha256HashRepository(),
            ),
          },
        },
        request: new Request('http://localhost'),
      })
      expect.fail('should throw error')
    } catch (e) {
      expect(e).toEqual({ status: 400, body: { message: 'Invalid account ID' } })
    }
  })

  test('should throw error if account does not exist', async ({ dbConnection }) => {
    try {
      await actions.create({
        params: { id: '1' },
        locals: {
          dbConnection,
          user: { id: 1 },
          services: {
            api: new ApiService(
              new DrizzleApiKeyRepository(dbConnection),
              new Sha256HashRepository(),
            ),
          },
        },
        request: new Request('http://localhost'),
      })
      expect.fail('should throw error')
    } catch (e) {
      expect(e).toEqual({ status: 404, body: { message: 'Account not found' } })
    }
  })

  test('should create a new key', async ({ dbConnection }) => {
    const accountsDb = new AccountsDatabase()
    await accountsDb.insert(
      [{ id: 1, username: 'test-user', password: 'test-password' }],
      dbConnection,
    )

    const formData = new FormData()
    formData.set('name', 'New API Key')

    await actions.create({
      params: { id: '1' },
      locals: {
        dbConnection,
        user: { id: 1 },
        services: {
          api: new ApiService(
            new DrizzleApiKeyRepository(dbConnection),
            new Sha256HashRepository(),
          ),
        },
      },
      request: new Request('http://localhost', { method: 'POST', body: formData }),
    })

    const apiKeysDb = new ApiKeysDatabase()
    const keys = await apiKeysDb.findByAccountId(1, dbConnection)
    expect(keys).toEqual([
      {
        id: expect.any(Number) as number,
        accountId: 1,
        name: 'New API Key',
        keyHash: expect.any(String) as string,
        createdAt: expect.any(Date) as Date,
      },
    ])
  })

  test('should return the created key which should resolve to the stored hash', async ({
    dbConnection,
  }) => {
    const accountsDb = new AccountsDatabase()
    await accountsDb.insert(
      [{ id: 1, username: 'test-user', password: 'test-password' }],
      dbConnection,
    )

    const formData = new FormData()
    formData.set('name', 'New API Key')

    const res = await actions.create({
      params: { id: '1' },
      locals: {
        dbConnection,
        user: { id: 1 },
        services: {
          api: new ApiService(
            new DrizzleApiKeyRepository(dbConnection),
            new Sha256HashRepository(),
          ),
        },
      },
      request: new Request('http://localhost', { method: 'POST', body: formData }),
    })

    const apiKeysDb = new ApiKeysDatabase()
    const [{ keyHash }] = await apiKeysDb.findByAccountId(1, dbConnection)

    if (!('success' in res && res.success === true)) {
      expect.fail('create failed')
    }
    expect(res.name).toEqual('New API Key')
    expect(await checkApiKey(res.key, keyHash)).toBe(true)
  })

  test('should throw an error when key name is not included', async ({ dbConnection }) => {
    const accountsDb = new AccountsDatabase()
    await accountsDb.insert(
      [{ id: 1, username: 'test-user', password: 'test-password' }],
      dbConnection,
    )

    const formData = new FormData()

    const res = await actions.create({
      params: { id: '1' },
      locals: {
        dbConnection,
        user: { id: 1 },
        services: {
          api: new ApiService(
            new DrizzleApiKeyRepository(dbConnection),
            new Sha256HashRepository(),
          ),
        },
      },
      request: new Request('http://localhost', { method: 'POST', body: formData }),
    })
    expect(res).toEqual({
      status: 400,
      data: { action: 'create', errors: { name: ['Expected string, received null'] } },
    })
  })

  test('should throw an error when key name is empty', async ({ dbConnection }) => {
    const accountsDb = new AccountsDatabase()
    await accountsDb.insert(
      [{ id: 1, username: 'test-user', password: 'test-password' }],
      dbConnection,
    )

    const formData = new FormData()
    formData.set('name', '')

    const res = await actions.create({
      params: { id: '1' },
      locals: {
        dbConnection,
        user: { id: 1 },
        services: {
          api: new ApiService(
            new DrizzleApiKeyRepository(dbConnection),
            new Sha256HashRepository(),
          ),
        },
      },
      request: new Request('http://localhost', { method: 'POST', body: formData }),
    })
    expect(res).toEqual({
      status: 400,
      data: { action: 'create', errors: { name: ['Name is required'] } },
    })
  })
})

describe('delete', () => {
  test('should throw error if not logged in', async ({ dbConnection }) => {
    try {
      await actions.delete({
        params: { id: '1' },
        locals: {
          dbConnection,
          user: undefined,
          services: {
            api: new ApiService(
              new DrizzleApiKeyRepository(dbConnection),
              new Sha256HashRepository(),
            ),
          },
        },
        request: new Request('http://localhost'),
      })
      expect.fail('should throw error')
    } catch (e) {
      expect(e).toEqual({ status: 401, body: { message: 'Unauthorized' } })
    }
  })

  test('should throw error if account is not the one currently logged in', async ({
    dbConnection,
  }) => {
    try {
      await actions.delete({
        params: { id: '1' },
        locals: {
          dbConnection,
          user: undefined,
          services: {
            api: new ApiService(
              new DrizzleApiKeyRepository(dbConnection),
              new Sha256HashRepository(),
            ),
          },
        },
        request: new Request('http://localhost'),
      })
      expect.fail('should throw error')
    } catch (e) {
      expect(e).toEqual({ status: 401, body: { message: 'Unauthorized' } })
    }
  })

  test('should throw error if account id is not a number', async ({ dbConnection }) => {
    const accountsDb = new AccountsDatabase()
    const [account] = await accountsDb.insert(
      [{ username: 'test-user', password: 'test-password' }],
      dbConnection,
    )

    try {
      await actions.delete({
        params: { id: 'test' },
        locals: {
          dbConnection,
          user: { id: account.id },
          services: {
            api: new ApiService(
              new DrizzleApiKeyRepository(dbConnection),
              new Sha256HashRepository(),
            ),
          },
        },
        request: new Request('http://localhost'),
      })
      expect.fail('should throw error')
    } catch (e) {
      expect(e).toEqual({ status: 400, body: { message: 'Invalid account ID' } })
    }
  })

  test('should throw error if account does not exist', async ({ dbConnection }) => {
    try {
      await actions.delete({
        params: { id: '1' },
        locals: {
          dbConnection,
          user: { id: 1 },
          services: {
            api: new ApiService(
              new DrizzleApiKeyRepository(dbConnection),
              new Sha256HashRepository(),
            ),
          },
        },
        request: new Request('http://localhost'),
      })
      expect.fail('should throw error')
    } catch (e) {
      expect(e).toEqual({ status: 404, body: { message: 'Account not found' } })
    }
  })

  test('should delete the requested key', async ({ dbConnection }) => {
    const accountsDb = new AccountsDatabase()
    const [account] = await accountsDb.insert(
      [{ username: 'test-user', password: 'test-password' }],
      dbConnection,
    )

    const createApiKey = new CreateApiKeyCommand(new DrizzleApiKeyRepository(dbConnection))
    const apiKey = await createApiKey.execute('test-key-1', account.id)

    const formData = new FormData()
    formData.set('id', apiKey.id.toString())

    await actions.delete({
      params: { id: account.id.toString() },
      locals: {
        dbConnection,
        user: { id: account.id },
        services: {
          api: new ApiService(
            new DrizzleApiKeyRepository(dbConnection),
            new Sha256HashRepository(),
          ),
        },
      },
      request: new Request('http://localhost', { method: 'POST', body: formData }),
    })

    const apiKeysDb = new ApiKeysDatabase()
    const keys = await apiKeysDb.findByAccountId(account.id, dbConnection)
    expect(keys).toEqual([])
  })

  test('should throw error if the key is not yours', async ({ dbConnection }) => {
    const accountsDb = new AccountsDatabase()
    const [account1, account2] = await accountsDb.insert(
      [
        { username: 'test-user-1', password: 'test-password-1' },
        { username: 'test-user-2', password: 'test-password-2' },
      ],
      dbConnection,
    )

    const createApiKey = new CreateApiKeyCommand(new DrizzleApiKeyRepository(dbConnection))
    await createApiKey.execute('test-api-key-1', account1.id)
    const apiKey2 = await createApiKey.execute('test-api-key-2', account2.id)

    const formData = new FormData()
    formData.set('id', apiKey2.id.toString())

    try {
      await actions.delete({
        params: { id: account1.id.toString() },
        locals: {
          dbConnection,
          user: undefined,
          services: {
            api: new ApiService(
              new DrizzleApiKeyRepository(dbConnection),
              new Sha256HashRepository(),
            ),
          },
        },
        request: new Request('http://localhost', { method: 'POST', body: formData }),
      })
      expect.fail('should throw error')
    } catch (e) {
      expect(e).toEqual({ status: 401, body: { message: 'Unauthorized' } })
    }
  })

  test('should throw error if the api key id is not a number', async ({ dbConnection }) => {
    const accountsDb = new AccountsDatabase()
    const [account] = await accountsDb.insert(
      [{ username: 'test-user', password: 'test-password' }],
      dbConnection,
    )

    const formData = new FormData()
    formData.set('id', 'test')

    const res = await actions.delete({
      params: { id: account.id.toString() },
      locals: {
        dbConnection,
        user: { id: account.id },
        services: {
          api: new ApiService(
            new DrizzleApiKeyRepository(dbConnection),
            new Sha256HashRepository(),
          ),
        },
      },
      request: new Request('http://localhost', { method: 'POST', body: formData }),
    })
    expect(res).toEqual({
      status: 400,
      data: { action: 'delete', errors: { id: ['Expected number, received nan'] } },
    })
  })

  test('should not throw error if the api key id does not exist', async ({ dbConnection }) => {
    const accountsDb = new AccountsDatabase()
    const [account] = await accountsDb.insert(
      [{ username: 'test-user', password: 'test-password' }],
      dbConnection,
    )

    const formData = new FormData()
    formData.set('id', '1')

    try {
      await actions.delete({
        params: { id: account.id.toString() },
        locals: {
          dbConnection,
          user: { id: account.id },
          services: {
            api: new ApiService(
              new DrizzleApiKeyRepository(dbConnection),
              new Sha256HashRepository(),
            ),
          },
        },
        request: new Request('http://localhost', { method: 'POST', body: formData }),
      })
    } catch {
      expect.fail('should not throw error')
    }
  })
})
