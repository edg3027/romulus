import { GenreRelevanceInput } from '../common/inputs'
import { z } from 'zod'

export const GenreRelevanceVoteInput = z.object({
  genreId: z.number(),
  relevance: GenreRelevanceInput,
})
export type GenreRelevanceVoteInput = z.infer<typeof GenreRelevanceVoteInput>

export const DeleteGenreRelevanceVoteInput = z.object({ genreId: z.number() })
export type DeleteGenreRelevanceVoteInput = z.infer<
  typeof DeleteGenreRelevanceVoteInput
>
