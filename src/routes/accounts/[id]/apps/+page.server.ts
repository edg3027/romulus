import { error, fail } from '@sveltejs/kit'
import { generateIdFromEntropySize } from 'lucia'
import { sha256 } from 'oslo/crypto'
import { encodeHex } from 'oslo/encoding'
import { pick } from 'ramda'
import { z } from 'zod'

import { generateApiKey, hashApiKey } from '$lib/server/api-keys'
import { AccountsDatabase } from '$lib/server/db/controllers/accounts'
import { ApiKeysDatabase } from '$lib/server/db/controllers/api-keys'

import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types'

export const load = (async ({
  params,
  locals,
}: {
  params: PageServerLoadEvent['params']
  locals: {
    dbConnection: App.Locals['dbConnection']
    user: Pick<NonNullable<App.Locals['user']>, 'id'> | undefined
  }
}) => {
  if (!locals.user) {
    return error(401, 'Unauthorized')
  }

  const maybeId = z.coerce.number().int().safeParse(params.id)
  if (!maybeId.success) {
    return error(400, 'Invalid account ID')
  }
  const id = maybeId.data

  if (locals.user.id !== id) {
    return error(401, 'Unauthorized')
  }

  const accountsDb = new AccountsDatabase()
  const maybeAccount = await accountsDb.findById(id, locals.dbConnection)
  if (!maybeAccount) {
    return error(404, 'Account not found')
  }
  const account = maybeAccount

  const apiKeysDb = new ApiKeysDatabase()
  const keys = await apiKeysDb.findByAccountId(account.id, locals.dbConnection)

  return { keys: keys.map((key) => pick(['name', 'createdAt'], key)) }
}) satisfies PageServerLoad

export const actions = {
  create: async ({
    params,
    locals,
    request,
  }: {
    params: RequestEvent['params']
    locals: {
      dbConnection: App.Locals['dbConnection']
      user: Pick<NonNullable<App.Locals['user']>, 'id'> | undefined
    }
    request: RequestEvent['request']
  }) => {
    if (!locals.user) {
      return error(401, 'Unauthorized')
    }

    const maybeId = z.coerce.number().int().safeParse(params.id)
    if (!maybeId.success) {
      return error(400, 'Invalid account ID')
    }
    const id = maybeId.data

    if (locals.user.id !== id) {
      return error(401, 'Unauthorized')
    }

    const accountsDb = new AccountsDatabase()
    const maybeAccount = await accountsDb.findById(id, locals.dbConnection)
    if (!maybeAccount) {
      return error(404, 'Account not found')
    }
    const account = maybeAccount

    const data = await request.formData()
    const nameField = data.get('name')

    if (nameField === null) {
      throw fail(400, { missing: true })
    }

    const name = nameField.toString()

    const key = generateApiKey()
    const keyHash = await hashApiKey(key)

    const apiKeysDb = new ApiKeysDatabase()
    await apiKeysDb.insert([{ accountId: account.id, name, keyHash }], locals.dbConnection)

    return key
  },
} satisfies Actions