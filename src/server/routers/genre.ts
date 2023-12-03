import { Permission } from '@prisma/client'
import { z } from 'zod'

import {
  createGenre,
  deleteGenre,
  editGenre,
  getGenre,
  getPaginatedGenres,
  getSimpleGenre,
  getSimpleGenres,
  getTopLevelTreeGenres,
  getTreeGenreChildren,
  getTreeStructure,
  searchSimpleGenres,
} from '../db/genre'
import {
  CreateGenreInput,
  DeleteGenreInput,
  EditGenreInput,
  Sort,
} from '../db/genre/inputs'
import { requirePermission } from '../guards'
import { publicProcedure, router } from '../trpc'
import { genreHistoryRouter } from './genre-history'
import { genreRelevanceRouter } from './genre-relevance'

const genreTreeRouter = router({
  topLevel: publicProcedure.query(() => getTopLevelTreeGenres()),
  children: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input: { id } }) => getTreeGenreChildren(id)),
  structure: publicProcedure.query(() => getTreeStructure()),
})

export const genreRouter = router({
  tree: genreTreeRouter,

  /* Create */
  add: publicProcedure
    .input(CreateGenreInput)
    .mutation(async ({ input, ctx }) => {
      const { account } = requirePermission(ctx, Permission.EDIT_GENRES)
      return createGenre(input, account.id)
    }),

  /* Read */
  history: genreHistoryRouter,
  relevance: genreRelevanceRouter,
  paginated: publicProcedure
    .input(z.object({ page: z.number(), size: z.number(), sort: Sort.array() }))
    .query(async ({ input: { page, size, sort } }) =>
      getPaginatedGenres(page, size > 100 ? 100 : size, sort)
    ),
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input: { id } }) => getGenre(id)),
  byIdSimple: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input: { id } }) => getSimpleGenre(id)),
  searchSimple: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input: { query } }) => searchSimpleGenres(query)),
  allSimple: publicProcedure.query(() => getSimpleGenres()),

  /* Update */
  edit: publicProcedure
    .input(EditGenreInput)
    .mutation(async ({ input, ctx }) => {
      const { account } = requirePermission(ctx, Permission.EDIT_GENRES)
      return editGenre(input, account.id)
    }),

  /* Delete */
  delete: publicProcedure
    .input(DeleteGenreInput)
    .mutation(async ({ input: { id }, ctx }) => {
      const { account } = requirePermission(ctx, Permission.EDIT_GENRES)
      return deleteGenre(id, account.id)
    }),
})
