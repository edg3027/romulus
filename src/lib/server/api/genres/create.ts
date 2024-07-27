import { omit } from 'ramda'

import type { IGenresDatabase } from '$lib/server/db/controllers/genre'
import type { IGenreHistoryDatabase } from '$lib/server/db/controllers/genre-history'
import type { IGenreRelevanceVotesDatabase } from '$lib/server/db/controllers/genre-relevance-votes'
import { UNSET_GENRE_RELEVANCE } from '$lib/types/genres'

import type { Account } from '../../db/schema'
import type { GenreData } from './types'

export async function createGenre(
  data: GenreData,
  accountId: Account['id'],
  genresDb: IGenresDatabase,
  genreHistoryDb: IGenreHistoryDatabase,
  genreRelevanceVotesDb: IGenreRelevanceVotesDatabase,
) {
  const [genre] = await genresDb.insert({
    ...data,
    akas: [
      ...(data.primaryAkas ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((name, order) => ({ name, relevance: 3, order })),
      ...(data.secondaryAkas ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((name, order) => ({ name, relevance: 2, order })),
      ...(data.tertiaryAkas ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((name, order) => ({ name, relevance: 1, order })),
    ],
    updatedAt: new Date(),
  })

  await genreHistoryDb.insert({
    ...omit(['id', 'parents', 'influencedBy', 'createdAt', 'updatedAt'], genre),
    treeGenreId: genre.id,
    parentGenreIds: genre.parents,
    influencedByGenreIds: genre.influencedBy,
    operation: 'CREATE',
    accountId,
    akas: genre.akas,
  })

  if (data.relevance !== undefined && data.relevance !== UNSET_GENRE_RELEVANCE) {
    await genreRelevanceVotesDb.upsert({
      genreId: genre.id,
      accountId,
      relevance: data.relevance,
      updatedAt: new Date(),
    })
  }

  return {
    ...genre,
    parents: genre.parents,
    influencedBy: genre.influencedBy,
  }
}
