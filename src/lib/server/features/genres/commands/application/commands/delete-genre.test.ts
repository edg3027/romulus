import { expect } from 'vitest'

import { AccountsDatabase } from '$lib/server/db/controllers/accounts'
import { type ExtendedInsertGenre, GenresDatabase } from '$lib/server/db/controllers/genre'
import { GenreHistoryDatabase } from '$lib/server/db/controllers/genre-history'
import { NotFoundError } from '$lib/server/features/genres/commands/application/commands/update-genre'

import { test } from '../../../../../../../vitest-setup'
import { DrizzleGenreRepository } from '../../infrastructure/genre/drizzle-genre-repository'
import { DrizzleGenreHistoryRepository } from '../../infrastructure/genre-history/drizzle-genre-history-repository'
import { DeleteGenreCommand } from './delete-genre'

function getTestGenre(data?: Partial<ExtendedInsertGenre>): ExtendedInsertGenre {
  return { name: 'Test', akas: [], parents: [], influencedBy: [], updatedAt: new Date(), ...data }
}

test('should delete the genre', async ({ dbConnection }) => {
  const genresDb = new GenresDatabase()
  const [genre] = await genresDb.insert([getTestGenre()], dbConnection)

  const accountId = new AccountsDatabase()
  const [account] = await accountId.insert([{ username: 'Test', password: 'Test' }], dbConnection)

  const deleteGenreCommand = new DeleteGenreCommand(
    new DrizzleGenreRepository(dbConnection),
    new DrizzleGenreHistoryRepository(dbConnection),
  )

  await deleteGenreCommand.execute(genre.id, account.id)

  const genres = await genresDb.findAllIds(dbConnection)
  expect(genres).toHaveLength(0)
})

test('should throw NotFoundError if genre not found', async ({ dbConnection }) => {
  const accountId = new AccountsDatabase()
  const [account] = await accountId.insert([{ username: 'Test', password: 'Test' }], dbConnection)

  const deleteGenreCommand = new DeleteGenreCommand(
    new DrizzleGenreRepository(dbConnection),
    new DrizzleGenreHistoryRepository(dbConnection),
  )

  await expect(deleteGenreCommand.execute(0, account.id)).rejects.toThrow(NotFoundError)
})

test('should create a genre history entry', async ({ dbConnection }) => {
  const pastDate = new Date('2000-01-01')
  const genresDb = new GenresDatabase()
  const [genre] = await genresDb.insert(
    [getTestGenre({ createdAt: pastDate, updatedAt: pastDate })],
    dbConnection,
  )

  const accountId = new AccountsDatabase()
  const [account] = await accountId.insert([{ username: 'Test', password: 'Test' }], dbConnection)

  const beforeExecute = new Date()
  const deleteGenreCommand = new DeleteGenreCommand(
    new DrizzleGenreRepository(dbConnection),
    new DrizzleGenreHistoryRepository(dbConnection),
  )

  await deleteGenreCommand.execute(genre.id, account.id)
  const afterExecute = new Date()

  const genreHistoryDb = new GenreHistoryDatabase()
  const genreHistory = await genreHistoryDb.findByGenreId(genre.id, dbConnection)
  expect(genreHistory).toEqual([
    {
      account: {
        id: account.id,
        username: 'Test',
      },
      accountId: account.id,
      akas: [],
      createdAt: expect.any(Date) as Date,
      id: 1,
      influencedByGenreIds: [],
      longDescription: null,
      name: 'Test',
      notes: null,
      nsfw: false,
      operation: 'DELETE',
      parentGenreIds: [],
      shortDescription: null,
      subtitle: null,
      treeGenreId: 1,
      type: 'STYLE',
    },
  ])

  expect(genreHistory[0].createdAt.getTime()).toBeGreaterThanOrEqual(beforeExecute.getTime())
  expect(genreHistory[0].createdAt.getTime()).toBeLessThanOrEqual(afterExecute.getTime())
  expect(genreHistory[0].createdAt).not.toEqual(pastDate)
})

test("should move child genres under deleted genre's parents", async ({ dbConnection }) => {
  const genresDb = new GenresDatabase()
  const [, child] = await genresDb.insert(
    [
      getTestGenre({ id: 0, name: 'Parent' }),
      getTestGenre({ id: 1, name: 'Child', parents: [0] }),
      getTestGenre({ id: 2, name: 'Grandchild', parents: [1] }),
    ],
    dbConnection,
  )

  const accountId = new AccountsDatabase()
  const [account] = await accountId.insert([{ username: 'Test', password: 'Test' }], dbConnection)

  const deleteGenreCommand = new DeleteGenreCommand(
    new DrizzleGenreRepository(dbConnection),
    new DrizzleGenreHistoryRepository(dbConnection),
  )

  await deleteGenreCommand.execute(child.id, account.id)

  const genres = await genresDb.findAll({ include: ['parents'] }, dbConnection)
  expect(genres.results).toEqual([
    expect.objectContaining({
      id: 0,
      name: 'Parent',
      parents: [],
    }),
    expect.objectContaining({
      id: 2,
      name: 'Grandchild',
      parents: [0],
    }),
  ])
})

test('should create history entries for children that were moved', async ({ dbConnection }) => {
  const pastDate = new Date('2000-01-01')
  const genresDb = new GenresDatabase()
  const [parent, child, grandchild] = await genresDb.insert(
    [
      getTestGenre({ id: 0, name: 'Parent', createdAt: pastDate, updatedAt: pastDate }),
      getTestGenre({
        id: 1,
        name: 'Child',
        parents: [0],
        createdAt: pastDate,
        updatedAt: pastDate,
      }),
      getTestGenre({
        id: 2,
        name: 'Grandchild',
        parents: [1],
        createdAt: pastDate,
        updatedAt: pastDate,
      }),
    ],
    dbConnection,
  )

  const accountId = new AccountsDatabase()
  const [account] = await accountId.insert([{ username: 'Test', password: 'Test' }], dbConnection)

  const beforeExecute = new Date()
  const deleteGenreCommand = new DeleteGenreCommand(
    new DrizzleGenreRepository(dbConnection),
    new DrizzleGenreHistoryRepository(dbConnection),
  )

  await deleteGenreCommand.execute(child.id, account.id)
  const afterExecute = new Date()

  const genreHistoryDb = new GenreHistoryDatabase()

  const parentHistory = await genreHistoryDb.findByGenreId(parent.id, dbConnection)
  expect(parentHistory).toEqual([])

  const childHistory = await genreHistoryDb.findByGenreId(child.id, dbConnection)
  expect(childHistory).toEqual([
    {
      account: {
        id: account.id,
        username: 'Test',
      },
      accountId: account.id,
      akas: [],
      createdAt: expect.any(Date) as Date,
      id: 1,
      influencedByGenreIds: [],
      longDescription: null,
      name: 'Child',
      notes: null,
      nsfw: false,
      operation: 'DELETE',
      parentGenreIds: [0],
      shortDescription: null,
      subtitle: null,
      treeGenreId: 1,
      type: 'STYLE',
    },
  ])
  expect(childHistory[0].createdAt.getTime()).toBeGreaterThanOrEqual(beforeExecute.getTime())
  expect(childHistory[0].createdAt.getTime()).toBeLessThanOrEqual(afterExecute.getTime())
  expect(childHistory[0].createdAt).not.toEqual(pastDate)

  const grandchildHistory = await genreHistoryDb.findByGenreId(grandchild.id, dbConnection)
  expect(grandchildHistory).toEqual([
    {
      account: {
        id: account.id,
        username: 'Test',
      },
      accountId: account.id,
      akas: [],
      createdAt: expect.any(Date) as Date,
      id: 2,
      influencedByGenreIds: [],
      longDescription: null,
      name: 'Grandchild',
      notes: null,
      nsfw: false,
      operation: 'UPDATE',
      parentGenreIds: [0],
      shortDescription: null,
      subtitle: null,
      treeGenreId: 2,
      type: 'STYLE',
    },
  ])
  expect(grandchildHistory[0].createdAt.getTime()).toBeGreaterThanOrEqual(beforeExecute.getTime())
  expect(grandchildHistory[0].createdAt.getTime()).toBeLessThanOrEqual(afterExecute.getTime())
  expect(grandchildHistory[0].createdAt).not.toEqual(pastDate)
})
