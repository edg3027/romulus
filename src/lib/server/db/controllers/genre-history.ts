import { and, asc, desc, eq, lt } from 'drizzle-orm'

import type { IDrizzleConnection } from '../connection'
import {
  type Account,
  type GenreHistory,
  genreHistory,
  type GenreHistoryAka,
  genreHistoryAkas,
  type InsertGenreHistory,
  type InsertGenreHistoryAka,
} from '../schema'

export interface IGenreHistoryDatabase<T> {
  insert: (
    data: (InsertGenreHistory & { akas: Omit<InsertGenreHistoryAka, 'genreId'>[] })[],
    conn: T,
  ) => Promise<GenreHistory[]>

  findLatest: (conn: T) => Promise<
    (GenreHistory & {
      akas: Pick<GenreHistoryAka, 'name'>[]
      account: Pick<Account, 'id' | 'username'> | null
    })[]
  >

  findLatestByGenreId: (
    genreId: GenreHistory['treeGenreId'],
    conn: T,
  ) => Promise<
    (GenreHistory & { akas: Pick<GenreHistoryAka, 'name' | 'relevance' | 'order'>[] }) | undefined
  >

  findPreviousByGenreId: (
    genreId: GenreHistory['treeGenreId'],
    createdAt: Date,
    conn: T,
  ) => Promise<(GenreHistory & { akas: Pick<GenreHistoryAka, 'name'>[] }) | undefined>

  findByGenreId: (
    genreId: GenreHistory['treeGenreId'],
    conn: T,
  ) => Promise<
    (GenreHistory & {
      akas: Pick<GenreHistoryAka, 'name'>[]
      account: Pick<Account, 'id' | 'username'> | null
    })[]
  >

  findByAccountId: (
    accountId: NonNullable<GenreHistory['accountId']>,
    conn: T,
  ) => Promise<
    Pick<
      GenreHistory,
      'id' | 'name' | 'type' | 'subtitle' | 'operation' | 'createdAt' | 'treeGenreId' | 'nsfw'
    >[]
  >
}

export class GenreHistoryDatabase implements IGenreHistoryDatabase<IDrizzleConnection> {
  insert(
    data: (InsertGenreHistory & { akas: Omit<InsertGenreHistoryAka, 'genreId'>[] })[],
    conn: IDrizzleConnection,
  ) {
    return conn.transaction(async (tx) => {
      const values = await tx.insert(genreHistory).values(data).returning()

      const akas = data.flatMap((entry, i) =>
        entry.akas.map((aka) => ({ ...aka, genreId: values[i].id })),
      )

      if (akas.length > 0) {
        await tx.insert(genreHistoryAkas).values(akas)
      }

      return values
    })
  }

  findLatest(conn: IDrizzleConnection) {
    return conn.query.genreHistory.findMany({
      orderBy: (genreHistory, { desc }) => desc(genreHistory.createdAt),
      with: {
        akas: {
          columns: { name: true },
          orderBy: [desc(genreHistoryAkas.relevance), asc(genreHistoryAkas.order)],
        },
        account: {
          columns: {
            id: true,
            username: true,
          },
        },
      },
      limit: 100,
    })
  }

  findLatestByGenreId(genreId: GenreHistory['treeGenreId'], conn: IDrizzleConnection) {
    return conn.query.genreHistory.findFirst({
      where: eq(genreHistory.treeGenreId, genreId),
      orderBy: desc(genreHistory.createdAt),
      with: {
        akas: {
          columns: {
            name: true,
            relevance: true,
            order: true,
          },
          orderBy: [desc(genreHistoryAkas.relevance), asc(genreHistoryAkas.order)],
        },
      },
    })
  }

  findPreviousByGenreId(
    genreId: GenreHistory['treeGenreId'],
    createdAt: Date,
    conn: IDrizzleConnection,
  ) {
    return conn.query.genreHistory.findFirst({
      where: and(eq(genreHistory.treeGenreId, genreId), lt(genreHistory.createdAt, createdAt)),
      orderBy: desc(genreHistory.createdAt),
      with: {
        akas: {
          columns: { name: true },
          orderBy: [desc(genreHistoryAkas.relevance), asc(genreHistoryAkas.order)],
        },
      },
    })
  }

  findByGenreId(genreId: GenreHistory['treeGenreId'], conn: IDrizzleConnection) {
    return conn.query.genreHistory.findMany({
      where: (genreHistory, { eq }) => eq(genreHistory.treeGenreId, genreId),
      orderBy: asc(genreHistory.createdAt),
      with: {
        akas: {
          columns: { name: true },
          orderBy: [desc(genreHistoryAkas.relevance), asc(genreHistoryAkas.order)],
        },
        account: {
          columns: {
            id: true,
            username: true,
          },
        },
      },
    })
  }

  findByAccountId(accountId: NonNullable<GenreHistory['accountId']>, conn: IDrizzleConnection) {
    return conn.query.genreHistory.findMany({
      where: eq(genreHistory.accountId, accountId),
      columns: {
        id: true,
        name: true,
        type: true,
        subtitle: true,
        operation: true,
        createdAt: true,
        treeGenreId: true,
        nsfw: true,
      },
      orderBy: desc(genreHistory.createdAt),
    })
  }
}