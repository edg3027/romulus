import { getByGenreId } from '.'
import { prisma } from '../../prisma'
import { median } from 'ramda'

export const getRelevanceFromVotes = (votes: number[]) =>
  Math.round(median(votes))

export const updateRelevance = async (genreId: number) => {
  const votes = await getByGenreId(genreId)
  const relevance = getRelevanceFromVotes(votes.map((vote) => vote.relevance))
  await prisma.genre.update({
    where: { id: genreId },
    data: { relevance },
  })
}
