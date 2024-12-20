import { type Actions, error, redirect } from '@sveltejs/kit'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

import { genreSchema } from '$lib/server/api/genres/types'
import { DerivedChildError } from '$lib/server/features/genres/commands/domain/errors/derived-child'
import { DerivedInfluenceError } from '$lib/server/features/genres/commands/domain/errors/derived-influence'
import { DuplicateAkaError } from '$lib/server/features/genres/commands/domain/errors/duplicate-aka'
import { InvalidGenreRelevanceError } from '$lib/server/features/genres/commands/domain/errors/invalid-genre-relevance'
import { SelfInfluenceError } from '$lib/server/features/genres/commands/domain/errors/self-influence'
import { UNSET_GENRE_RELEVANCE } from '$lib/types/genres'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user?.permissions?.includes('EDIT_GENRES')) {
    return error(403, { message: 'You do not have permission to create genres' })
  }

  const form = await superValidate(
    { type: 'STYLE', relevance: UNSET_GENRE_RELEVANCE },
    zod(genreSchema),
    { errors: false },
  )
  return { form }
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user?.permissions?.includes('EDIT_GENRES')) {
      return error(403, { message: 'You do not have permission to create genres' })
    }
    const user = locals.user

    const form = await superValidate(request, zod(genreSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    const genreData = {
      ...form.data,
      subtitle: form.data.subtitle ?? undefined,
      shortDescription: form.data.shortDescription ?? undefined,
      longDescription: form.data.longDescription ?? undefined,
      notes: form.data.notes ?? undefined,
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
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const createResult = await locals.di.genreCommandService().createGenre(genreData, user.id)
    if (createResult instanceof SelfInfluenceError) {
      return setError(form, 'influencedBy._errors', 'A genre cannot influence itself')
    } else if (createResult instanceof DuplicateAkaError) {
      return setError(form, getDuplicateAkaErrorField(createResult.level), createResult.message)
    } else if (createResult instanceof DerivedChildError) {
      return setError(form, 'derivedFrom._errors', createResult.message)
    } else if (createResult instanceof DerivedInfluenceError) {
      return setError(form, 'influencedBy._errors', createResult.message)
    }

    const relevance = form.data.relevance
    if (relevance !== undefined) {
      const voteResult = await locals.di
        .genreCommandService()
        .voteGenreRelevance(createResult.id, relevance, user.id)

      if (voteResult instanceof InvalidGenreRelevanceError) {
        return setError(form, 'relevance', voteResult.message)
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: void = voteResult
    }

    redirect(302, `/genres/${createResult.id}`)
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
