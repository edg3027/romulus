import { type Actions, error, redirect } from '@sveltejs/kit'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'

import { genreSchema } from '$lib/server/api/genres/types'
import { GenresDatabase } from '$lib/server/db/controllers/genre'
import {
  GenreCycleError,
  NotFoundError,
  NoUpdatesError,
  SelfInfluenceError,
} from '$lib/server/features/genres/commands/application/commands/update-genre'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user?.permissions?.includes('EDIT_GENRES')) {
    return error(403, { message: 'You do not have permission to edit genres' })
  }

  const maybeId = z.coerce.number().int().safeParse(params.id)
  if (!maybeId.success) {
    return error(400, { message: 'Invalid genre ID' })
  }
  const id = maybeId.data

  const genresDb = new GenresDatabase()
  const maybeGenre = await genresDb.findByIdEdit(id, locals.dbConnection)
  if (!maybeGenre) {
    return error(404, { message: 'Genre not found' })
  }

  const { akas, ...genre } = maybeGenre

  const data = {
    ...genre,
    primaryAkas: akas
      .filter((aka) => aka.relevance === 3)
      .map((aka) => aka.name)
      .join(', '),
    secondaryAkas: akas
      .filter((aka) => aka.relevance === 2)
      .map((aka) => aka.name)
      .join(', '),
    tertiaryAkas: akas
      .filter((aka) => aka.relevance === 1)
      .map((aka) => aka.name)
      .join(', '),
  }

  const form = await superValidate(data, zod(genreSchema))
  return { form }
}

export const actions: Actions = {
  default: async ({ params, request, locals }) => {
    if (!locals.user?.permissions?.includes('EDIT_GENRES')) {
      return error(403, { message: 'You do not have permission to edit genres' })
    }
    const user = locals.user

    const maybeId = z.coerce.number().int().safeParse(params.id)
    if (!maybeId.success) {
      return error(400, { message: 'Invalid genre ID' })
    }
    const id = maybeId.data

    const form = await superValidate(request, zod(genreSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    const genreUpdate = {
      ...form.data,
      parents: new Set(form.data.parents),
      influences: new Set(form.data.influencedBy),
      akas: {
        primary: form.data.primaryAkas?.length
          ? form.data.primaryAkas?.split(',').map((aka) => aka.trim())
          : [],
        secondary: form.data.secondaryAkas?.length
          ? form.data.secondaryAkas?.split(',').map((aka) => aka.trim())
          : [],
        tertiary: form.data.tertiaryAkas?.length
          ? form.data.tertiaryAkas?.split(',').map((aka) => aka.trim())
          : [],
      },
    }

    try {
      await locals.services.genre.updateGenre(id, genreUpdate, user.id)
    } catch (e) {
      if (e instanceof NotFoundError) {
        return error(404, { message: 'Genre not found' })
      } else if (e instanceof GenreCycleError) {
        return setError(form, 'parents._errors', `Cycle detected: ${e.cycle}`)
      } else if (e instanceof SelfInfluenceError) {
        return setError(form, 'influencedBy._errors', 'A genre cannot influence itself')
      } else if (e instanceof NoUpdatesError) {
        return redirect(302, `/genres/${id}`)
      } else {
        throw e
      }
    }

    redirect(302, `/genres/${id}`)
  },
}
