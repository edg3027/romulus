import { type Actions, error, redirect } from '@sveltejs/kit'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'

import { genreSchema } from '$lib/server/api/genres/types'
import { GenreNotFoundError } from '$lib/server/features/genres/commands/application/errors/genre-not-found'
import { DerivedChildError } from '$lib/server/features/genres/commands/domain/errors/derived-child'
import { DerivedInfluenceError } from '$lib/server/features/genres/commands/domain/errors/derived-influence'
import { DuplicateAkaError } from '$lib/server/features/genres/commands/domain/errors/duplicate-aka'
import { GenreCycleError } from '$lib/server/features/genres/commands/domain/errors/genre-cycle'
import { SelfInfluenceError } from '$lib/server/features/genres/commands/domain/errors/self-influence'

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

  const maybeGenre = await locals.di.genreQueryService().getGenre(id)
  if (!maybeGenre) {
    return error(404, { message: 'Genre not found' })
  }

  const { akas, ...genre } = maybeGenre

  const data = {
    ...genre,
    parents: genre.parents.map((parent) => parent.id),
    derivedFrom: genre.derivedFrom.map((derivedFrom) => derivedFrom.id),
    influencedBy: genre.influencedBy.map((influencer) => influencer.id),
    primaryAkas: akas.primary.join(', '),
    secondaryAkas: akas.secondary.join(', '),
    tertiaryAkas: akas.tertiary.join(', '),
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
      derivedFrom: new Set(form.data.derivedFrom),
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

    const updateResult = await locals.di.genreCommandService().updateGenre(id, genreUpdate, user.id)
    if (updateResult instanceof DuplicateAkaError) {
      return setError(form, getDuplicateAkaErrorField(updateResult.level), updateResult.message)
    } else if (updateResult instanceof GenreNotFoundError) {
      return error(404, { message: 'Genre not found' })
    } else if (updateResult instanceof SelfInfluenceError) {
      return setError(form, 'influencedBy._errors', 'A genre cannot influence itself')
    } else if (updateResult instanceof DerivedChildError) {
      return setError(form, 'derivedFrom._errors', updateResult.message)
    } else if (updateResult instanceof DerivedInfluenceError) {
      return setError(form, 'influencedBy._errors', updateResult.message)
    } else if (updateResult instanceof GenreCycleError) {
      return setError(form, 'parents._errors', updateResult.message)
    }

    redirect(302, `/genres/${id}`)
  },
}

function getDuplicateAkaErrorField(level: DuplicateAkaError['level']) {
  switch (level) {
    case 'primary':
      return 'primaryAkas' as const
    case 'secondary':
      return 'secondaryAkas' as const
    case 'tertiary':
      return 'tertiaryAkas' as const
  }
}
