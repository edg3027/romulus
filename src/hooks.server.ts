import type { Handle } from '@sveltejs/kit'

import { getDbConnection, getPostgresConnection, migrate } from '$lib/server/db/connection/postgres'
import * as schema from '$lib/server/db/schema'
import * as mediaSchema from '$lib/server/features/media/queries/infrastructure/drizzle-schema'

import { CompositionRoot } from './composition-root'

const pg = getPostgresConnection()
await migrate(getDbConnection(schema, pg))

process.on('sveltekit:shutdown', () => {
  void pg.end()
})

const SESSION_COOKIE_NAME = 'auth_session'

export const handle: Handle = async ({ event, resolve }) => {
  const dbConnection = getDbConnection(schema, pg)
  event.locals.dbConnection = dbConnection

  const mediaDbConnection = getDbConnection(mediaSchema, pg)

  event.locals.di = new CompositionRoot(dbConnection, SESSION_COOKIE_NAME, mediaDbConnection)

  const sessionToken = event.cookies.get(SESSION_COOKIE_NAME)
  event.locals.sessionToken = sessionToken

  if (!sessionToken) {
    event.locals.user = undefined
    return resolve(event)
  }

  const { account, cookie } = await event.locals.di
    .authenticationController()
    .validateSession(sessionToken)

  event.locals.user =
    account === undefined
      ? undefined
      : {
          id: account.id,
          username: account.username,
          permissions: [...account.permissions],
          genreRelevanceFilter: account.genreRelevanceFilter,
          showRelevanceTags: account.showRelevanceTags,
          showTypeTags: account.showTypeTags,
          showNsfw: account.showNsfw,
          darkMode: account.darkMode,
        }

  if (cookie) {
    event.cookies.set(cookie.name, cookie.value, {
      path: '.',
      ...cookie.attributes,
    })
  }

  const response = await resolve(event)

  return response
}
