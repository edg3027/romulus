import type { Actions } from '@sveltejs/kit'
import { error, redirect } from '@sveltejs/kit'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

import { mediaArtifactRelationshipTypeSchema } from '$lib/features/media/components/MediaArtifactRelationshipTypeForm'
import { routes } from '$lib/routes'

import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
  if (!locals.user?.permissions.mediaArtifactTypes.canCreate) {
    return error(403, {
      message: 'You do not have permission to create media artifact relationship types',
    })
  }

  const form = await superValidate(zod(mediaArtifactRelationshipTypeSchema), { errors: false })

  return { form }
}) satisfies PageServerLoad

export const actions = {
  default: async ({ request, locals }: { request: Request; locals: App.Locals }) => {
    const form = await superValidate(request, zod(mediaArtifactRelationshipTypeSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    const id = crypto.randomUUID()

    const result = await locals.di.media().createMediaArtifactRelationshipType({ id, ...form.data })
    if (result.isErr()) {
      switch (result.error.name) {
        case 'FetchError': {
          return error(500, result.error.message)
        }
        case 'MediaArtifactTypeNotFoundError': {
          const id = result.error.details.id
          if (form.data.parentMediaArtifactType === id) {
            return setError(form, 'parentMediaArtifactType', result.error.message)
          } else {
            return setError(form, 'childMediaArtifactTypes._errors', result.error.message)
          }
        }
        case 'BadRequestError':
        case 'UnauthenticatedError':
        case 'UnauthorizedError': {
          return error(result.error.statusCode, result.error.message)
        }
        default: {
          result.error satisfies never
        }
      }
    }

    return redirect(303, routes.media.artifactRelationshipTypes.route())
  },
} satisfies Actions
