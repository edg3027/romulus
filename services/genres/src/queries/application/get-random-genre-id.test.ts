import { expect } from 'vitest'

import {
  CreateGenreCommand,
  type CreateGenreInput,
} from '../../commands/application/commands/create-genre'
import { DrizzleGenreHistoryRepository } from '../../commands/infrastructure/drizzle-genre-history-repository'
import { DrizzleGenreRepository } from '../../commands/infrastructure/drizzle-genre-repository'
import { DrizzleGenreTreeRepository } from '../../commands/infrastructure/drizzle-genre-tree-repository'
import type { IDrizzleConnection } from '../../shared/infrastructure/drizzle-database'
import { MockAuthorizationApplication } from '../../test/mock-authorization-application'
import { test } from '../../vitest-setup'
import { GetRandomGenreIdQuery } from './get-random-genre-id'

async function createGenre(
  data: CreateGenreInput,
  accountId: number,
  dbConnection: IDrizzleConnection,
) {
  const createGenreCommand = new CreateGenreCommand(
    new DrizzleGenreRepository(dbConnection),
    new DrizzleGenreTreeRepository(dbConnection),
    new DrizzleGenreHistoryRepository(dbConnection),
    new MockAuthorizationApplication(),
  )

  const genre = await createGenreCommand.execute(data, accountId)

  if (genre instanceof Error) {
    expect.fail(`Failed to create genre: ${genre.message}`)
  }

  return genre
}

function getTestGenre(data?: Partial<CreateGenreInput>): CreateGenreInput {
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

test('should return undefined when no genres exist', async ({ dbConnection }) => {
  const query = new GetRandomGenreIdQuery(dbConnection)
  const result = await query.execute()
  expect(result).toBeUndefined()
})

test('should return the only id when only one genre exists', async ({ dbConnection }) => {
  const genre = await createGenre(getTestGenre(), 1, dbConnection)

  const query = new GetRandomGenreIdQuery(dbConnection)
  const result = await query.execute()
  expect(result).toEqual(genre.id)
})

test('should return a random id when multiple genres exist', async ({ dbConnection }) => {
  const accountId = 1

  const genre1 = await createGenre(getTestGenre(), accountId, dbConnection)
  const genre2 = await createGenre(getTestGenre(), accountId, dbConnection)

  const query = new GetRandomGenreIdQuery(dbConnection)
  const result = await query.execute()
  expect([genre1.id, genre2.id]).toContain(result)
})
