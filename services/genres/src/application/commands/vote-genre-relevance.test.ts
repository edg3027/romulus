import { expect } from 'vitest'

import type { IDrizzleConnection } from '../../infrastructure/drizzle-database.js'
import { DrizzleGenreHistoryRepository } from '../../infrastructure/drizzle-genre-history-repository.js'
import { DrizzleGenreRelevanceVoteRepository } from '../../infrastructure/drizzle-genre-relevance-vote-repository.js'
import { DrizzleGenreRepository } from '../../infrastructure/drizzle-genre-repository.js'
import { DrizzleGenreTreeRepository } from '../../infrastructure/drizzle-genre-tree-repository.js'
import { UNSET_GENRE_RELEVANCE } from '../../infrastructure/drizzle-schema.js'
import { MockAuthorizationService } from '../../test/mock-authorization-service.js'
import { test } from '../../vitest-setup.js'
import type { CreateGenreInput } from './create-genre.js'
import { CreateGenreCommand } from './create-genre.js'
import { GetGenreQuery } from './get-genre.js'
import { GetGenreRelevanceVotesByGenreQuery } from './get-genre-relevance-votes-by-genre.js'
import { VoteGenreRelevanceCommand } from './vote-genre-relevance.js'

async function createGenre(
  data: CreateGenreInput & { relevance?: number },
  accountId: number,
  dbConnection: IDrizzleConnection,
) {
  const createGenreCommand = new CreateGenreCommand(
    new DrizzleGenreRepository(dbConnection),
    new DrizzleGenreTreeRepository(dbConnection),
    new DrizzleGenreHistoryRepository(dbConnection),
    new MockAuthorizationService(),
  )

  const genre = await createGenreCommand.execute(data, accountId)

  if (genre.isErr()) {
    expect.fail(`Failed to create genre: ${genre.error.message}`)
  }

  if (data.relevance !== undefined) {
    const voteRelevanceCommand = new VoteGenreRelevanceCommand(
      new DrizzleGenreRelevanceVoteRepository(dbConnection),
      new MockAuthorizationService(),
    )

    const result = await voteRelevanceCommand.execute(genre.value.id, data.relevance, accountId)

    if (result instanceof Error) {
      expect.fail(`Failed to vote on genre relevance: ${result.message}`)
    }
  }

  return genre.value
}

function getTestGenre(
  data?: Partial<CreateGenreInput> & { relevance?: number },
): CreateGenreInput & { relevance?: number } {
  return {
    name: 'Test',
    type: 'STYLE',
    nsfw: false,
    parents: new Set(),
    derivedFrom: new Set(),
    influences: new Set(),
    akas: {
      primary: [],
      secondary: [],
      tertiary: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  }
}

async function vote(
  dbConnection: IDrizzleConnection,
  ...args: Parameters<VoteGenreRelevanceCommand['execute']>
) {
  const voteGenreRelevance = new VoteGenreRelevanceCommand(
    new DrizzleGenreRelevanceVoteRepository(dbConnection),
    new MockAuthorizationService(),
  )

  const voteResult = await voteGenreRelevance.execute(...args)
  if (voteResult instanceof Error) {
    expect.fail(`Failed to vote on genre relevance: ${voteResult.message}`)
  }
}

test('should delete vote and update relevance when relevance is UNSET_GENRE_RELEVANCE', async ({
  dbConnection,
}) => {
  const accountId = 1
  const genre = await createGenre(getTestGenre({ relevance: 1 }), accountId, dbConnection)

  const getGenreRelevanceVotesByGenreQuery = new GetGenreRelevanceVotesByGenreQuery(dbConnection)

  await vote(dbConnection, genre.id, 1, accountId)

  const relevanceVotesBeforeDeletion = await getGenreRelevanceVotesByGenreQuery.execute(genre.id)
  expect(relevanceVotesBeforeDeletion).toHaveLength(1)

  await vote(dbConnection, genre.id, UNSET_GENRE_RELEVANCE, accountId)

  const relevanceVotesAfterDeletion = await getGenreRelevanceVotesByGenreQuery.execute(genre.id)
  expect(relevanceVotesAfterDeletion).toHaveLength(0)

  const getGenreQuery = new GetGenreQuery(dbConnection)
  const updatedGenre = await getGenreQuery.execute(genre.id)
  if (updatedGenre.isErr()) {
    expect.fail(`GetGenreQuery errored: ${updatedGenre.error.message}`)
  }
  expect(updatedGenre.value.relevance).toBe(UNSET_GENRE_RELEVANCE)
})

test('should upsert vote and update relevance when relevance is not UNSET_GENRE_RELEVANCE', async ({
  dbConnection,
}) => {
  const accountId = 1
  const genre = await createGenre(getTestGenre({ relevance: 1 }), accountId, dbConnection)

  const getGenreRelevanceVotesByGenreQuery = new GetGenreRelevanceVotesByGenreQuery(dbConnection)

  await vote(dbConnection, genre.id, 1, accountId)

  const relevanceVotesBeforeVote = await getGenreRelevanceVotesByGenreQuery.execute(genre.id)
  expect(relevanceVotesBeforeVote).toEqual([
    expect.objectContaining({ genreId: genre.id, accountId: accountId, relevance: 1 }),
  ])

  await vote(dbConnection, genre.id, 2, accountId)

  const relevanceVotesAfterVote = await getGenreRelevanceVotesByGenreQuery.execute(genre.id)
  expect(relevanceVotesAfterVote).toEqual([
    expect.objectContaining({ genreId: genre.id, accountId: accountId, relevance: 2 }),
  ])

  const getGenreQuery = new GetGenreQuery(dbConnection)
  const updatedGenre = await getGenreQuery.execute(genre.id)
  if (updatedGenre.isErr()) {
    expect.fail(`GetGenreQuery errored: ${updatedGenre.error.message}`)
  }
  expect(updatedGenre.value.relevance).toBe(2)
})

test('should calculate median relevance correctly', async ({ dbConnection }) => {
  const account1Id = 1
  const account2Id = 2
  const account3Id = 3
  const account4Id = 4
  const account5Id = 5

  const genre = await createGenre(getTestGenre(), account1Id, dbConnection)

  await vote(dbConnection, genre.id, 1, account1Id)
  await vote(dbConnection, genre.id, 2, account2Id)
  await vote(dbConnection, genre.id, 3, account3Id)
  await vote(dbConnection, genre.id, 4, account4Id)
  await vote(dbConnection, genre.id, 5, account5Id)

  const getGenreQuery = new GetGenreQuery(dbConnection)
  const updatedGenre = await getGenreQuery.execute(genre.id)
  if (updatedGenre.isErr()) {
    expect.fail(`GetGenreQuery errored: ${updatedGenre.error.message}`)
  }
  expect(updatedGenre.value.relevance).toBe(3)
})

test('should round median relevance to nearest integer', async ({ dbConnection }) => {
  const account1Id = 1
  const account2Id = 2
  const account3Id = 3
  const account4Id = 4

  const genre = await createGenre(getTestGenre(), account1Id, dbConnection)

  await vote(dbConnection, genre.id, 1, account1Id)
  await vote(dbConnection, genre.id, 2, account2Id)
  await vote(dbConnection, genre.id, 3, account3Id)
  await vote(dbConnection, genre.id, 4, account4Id)

  const getGenreQuery = new GetGenreQuery(dbConnection)
  const updatedGenre = await getGenreQuery.execute(genre.id)
  if (updatedGenre.isErr()) {
    expect.fail(`GetGenreQuery errored: ${updatedGenre.error.message}`)
  }
  expect(updatedGenre.value.relevance).toBe(3)
})
