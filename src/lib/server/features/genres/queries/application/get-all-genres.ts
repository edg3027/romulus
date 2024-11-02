import { intersection } from 'ramda'

import type { IDrizzleConnection } from '$lib/server/db/connection'
import {
  type FindAllFilter,
  type FindAllGenre,
  type FindAllSortField,
  type FindAllSortOrder,
  GenresDatabase,
} from '$lib/server/db/controllers/genre'
import { GenreHistoryDatabase } from '$lib/server/db/controllers/genre-history'
import { GenreParentsDatabase } from '$lib/server/db/controllers/genre-parents'
import type { GenreType } from '$lib/types/genres'

export type GetAllGenresParams<I extends FindAllInclude> = {
  skip?: number
  limit?: number
  include?: I[]
  filter?: GetAllGenresFilter
  sort?: {
    field?: FindAllSortField
    order?: FindAllSortOrder
  }
}

type GetAllGenresFilter = {
  name?: string
  subtitle?: string | null
  type?: GenreType
  relevance?: number | null
  nsfw?: boolean
  shortDescription?: string | null
  longDescription?: string | null
  notes?: string | null
  createdAt?: Date
  updatedAt?: Date
  createdBy?: number
  parents?: number[]
  ancestors?: number[]
}

export type GetAllGenresResult<I extends FindAllInclude = never> = {
  data: FindAllGenre<I>[]
  pagination: { skip: number; limit: number; total: number }
}

export const FIND_ALL_INCLUDE = ['parents', 'influencedBy', 'akas'] as const
export type FindAllInclude = (typeof FIND_ALL_INCLUDE)[number]

export class GetAllGenresQuery {
  constructor(private db: IDrizzleConnection) {}

  async execute<I extends FindAllInclude = never>({
    skip = 0,
    limit = 25,
    include = [],
    filter: inputFilter = {},
    sort = {},
  }: GetAllGenresParams<I>): Promise<GetAllGenresResult> {
    const genresDb = new GenresDatabase()

    const databaseFilter = await this.constructDatabaseFilter(inputFilter)

    const { results, total } = await genresDb.findAll(
      { skip, limit, include, filter: databaseFilter, sort },
      this.db,
    )

    return {
      data: results,
      pagination: { skip, limit, total },
    }
  }

  private async constructDatabaseFilter(inputFilter: GetAllGenresFilter) {
    const databaseFilter: FindAllFilter = inputFilter

    if (inputFilter.createdBy !== undefined) {
      const ids = await this.getCreatedByFilterGenreIds(inputFilter.createdBy)
      databaseFilter.ids = ids
    }

    if (inputFilter.parents !== undefined) {
      const ids = await this.getParentsFilterGenreIds(inputFilter.parents)
      if (databaseFilter.ids !== undefined) {
        databaseFilter.ids = intersection(databaseFilter.ids, ids)
      } else {
        databaseFilter.ids = ids
      }
    }

    if (inputFilter.ancestors !== undefined) {
      const ids = await this.getAncestorsFilterGenreIds(inputFilter.ancestors)
      if (databaseFilter.ids !== undefined) {
        databaseFilter.ids = intersection(databaseFilter.ids, ids)
      } else {
        databaseFilter.ids = ids
      }
    }

    return databaseFilter
  }

  private async getCreatedByFilterGenreIds(accountId: number): Promise<number[]> {
    const genreHistoryDb = new GenreHistoryDatabase()
    const { results: history } = await genreHistoryDb.findAll(
      { filter: { accountId, operation: 'CREATE' } },
      this.db,
    )
    return history.map((h) => h.treeGenreId)
  }

  private async getParentsFilterGenreIds(parents: number[]): Promise<number[]> {
    const genreParentsDb = new GenreParentsDatabase()
    const allParentChildren = await Promise.all(
      parents.map((parentId) => genreParentsDb.findByParentId(parentId, this.db)),
    )
    const childIds = allParentChildren
      .map((parentChildren) => parentChildren.map((child) => child.childId))
      .reduce((acc, val) => intersection(acc, val))
    return childIds
  }

  private async getAncestorsFilterGenreIds(ancestors: number[]): Promise<number[]> {
    const genreParentsDb = new GenreParentsDatabase()
    const allParentChildren = await genreParentsDb.findAll(this.db)
    const parentsMap = allParentChildren.reduce(
      (acc, val) => {
        acc[val.parentId] = acc[val.parentId] ?? []
        acc[val.parentId].push(val.childId)
        return acc
      },
      {} as Record<number, number[]>,
    )

    const descendantLists = ancestors.map((ancestor) => this.dfs(ancestor, parentsMap))
    const descendantIds = descendantLists.reduce((acc, val) => intersection(acc, val))
    return descendantIds
  }

  private dfs(ancestor: number, parentsMap: Record<number, number[]>): number[] {
    const queue: number[] = [ancestor]
    const descendants: number[] = []
    let currentNode = queue.shift()
    while (currentNode !== undefined) {
      const children = parentsMap[currentNode] ?? []
      descendants.push(...children)
      queue.push(...children)
      currentNode = queue.shift()
    }
    return descendants
  }
}
