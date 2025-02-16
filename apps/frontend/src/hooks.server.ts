import type { AuthenticationClient } from '@romulus/authentication/client'
import type { AuthorizationClient } from '@romulus/authorization/client'
import { GenresPermission } from '@romulus/genres/permissions'
import type { Handle } from '@sveltejs/kit'

import { PUBLIC_API_BASE_URL } from '$env/static/public'
import { getSessionCookie, setSessionCookie } from '$lib/cookie'

import { CompositionRoot } from './composition-root'

export const handle: Handle = async ({ event, resolve }) => {
  const sessionToken = getSessionCookie(event.cookies)
  event.locals.di = new CompositionRoot(PUBLIC_API_BASE_URL, sessionToken)

  event.locals.user = await getUser(
    sessionToken,
    event.locals.di.authentication(),
    event.locals.di.authorization(),
  )

  if (event.locals.user) {
    const refreshSessionResult = await event.locals.di.authentication().refreshSession()
    if (refreshSessionResult.isErr()) {
      console.error('Failed to refresh session:', refreshSessionResult.error)
    } else {
      setSessionCookie(
        {
          token: refreshSessionResult.value.token,
          expires: refreshSessionResult.value.expiresAt,
        },
        event.cookies,
      )
    }
  }

  const response = await resolve(event)

  return response
}

async function getUser(
  sessionToken: string | undefined,
  authentication: AuthenticationClient,
  authorization: AuthorizationClient,
): Promise<App.Locals['user']> {
  if (sessionToken === undefined) return undefined

  const whoamiResult = await authentication.whoami()
  if (whoamiResult.isErr()) {
    return undefined
  }

  const account = whoamiResult.value.account
  const user: NonNullable<App.Locals['user']> = {
    id: account.id,
    username: account.username,
    permissions: {
      genres: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canVoteRelevance: false,
      },
    },
  }

  const permissionsResult = await authorization.getMyPermissions()
  if (permissionsResult.isErr()) {
    console.error('Failed to fetch user permissions:', permissionsResult.error)
    return user
  }
  const permissions = permissionsResult.value.permissions

  user.permissions.genres = {
    canCreate: permissions.has(GenresPermission.CreateGenres),
    canEdit: permissions.has(GenresPermission.EditGenres),
    canDelete: permissions.has(GenresPermission.DeleteGenres),
    canVoteRelevance: permissions.has(GenresPermission.VoteGenreRelevance),
  }
  return user
}
