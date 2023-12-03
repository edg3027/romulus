import { Sort } from '../server/db/genre/inputs'
import { TreeStructure } from '../server/db/genre/outputs'
import { ONE_MINUTE } from '../utils/datetime'
import { trpc } from '../utils/trpc'

export const usePaginatedGenresQuery = (
  page = 0,
  size = 30,
  sort: Sort[] = []
) => {
  return trpc.genre.paginated.useQuery(
    { page, size, sort },
    {
      keepPreviousData: true,
    }
  )
}

export const useSimpleGenresQuery = () => {
  return trpc.genre.allSimple.useQuery(undefined, {
    staleTime: Number.POSITIVE_INFINITY,
  })
}

export const useTopLevelTreeGenresQuery = () => {
  return trpc.genre.tree.topLevel.useQuery(undefined, {
    staleTime: ONE_MINUTE,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    showToast: false,
  })
}

export const useTreeGenreChildrenQuery = (genreId: number) => {
  return trpc.genre.tree.children.useQuery(
    { id: genreId },
    {
      staleTime: ONE_MINUTE,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      showToast: false,
    }
  )
}

export const useTreeStructureMapQuery = () => {
  return trpc.genre.tree.structure.useQuery(undefined, {
    select: (data: TreeStructure[]): Map<number, TreeStructure> =>
      new Map(data.map((genre) => [genre.id, genre])),
    staleTime: ONE_MINUTE,
  })
}

export const useSimpleGenreSearchQuery = (query: string) => {
  return trpc.genre.searchSimple.useQuery({ query })
}

export const useGenreQuery = (id: number) => {
  const utils = trpc.useContext()
  return trpc.genre.byId.useQuery(
    { id },
    {
      onSuccess: (data) => {
        utils.genre.byIdSimple.setData({ id: data.id }, data)
      },
    }
  )
}

export const useSimpleGenreQuery = (
  id: number,
  options: { showToast?: boolean } = {}
) =>
  trpc.genre.byIdSimple.useQuery(
    { id },
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      showToast: options.showToast,
    }
  )

export const useAddGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.genre.add.useMutation({
    onSuccess: async (data) => {
      utils.genre.byId.setData({ id: data.id }, data)
      utils.genre.byIdSimple.setData({ id: data.id }, data)
      await Promise.all([
        utils.genre.paginated.invalidate(),
        utils.genre.tree.topLevel.invalidate(),
        utils.genre.tree.children.invalidate(),
        utils.genre.tree.structure.invalidate(),
        utils.genre.searchSimple.invalidate(),
        utils.genre.history.byGenreId.invalidate(),
        utils.genre.history.byUserId.invalidate(),
        utils.genre.history.userCount.invalidate(),
      ])
    },
  })
}

export const useEditGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.genre.edit.useMutation({
    onSuccess: async (data) => {
      utils.genre.byId.setData({ id: data.id }, data)
      utils.genre.byIdSimple.setData({ id: data.id }, data)
      await Promise.all([
        utils.genre.paginated.invalidate(),
        utils.genre.tree.topLevel.invalidate(),
        utils.genre.tree.children.invalidate(),
        utils.genre.tree.structure.invalidate(),
        utils.genre.searchSimple.invalidate(),
        utils.genre.history.byGenreId.invalidate(),
        utils.genre.history.byUserId.invalidate(),
        utils.genre.history.userCount.invalidate(),
      ])
    },
  })
}

export const useDeleteGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.genre.delete.useMutation({
    onSuccess: async (data, { id }) => {
      await Promise.all([
        utils.genre.paginated.invalidate(),
        utils.genre.tree.topLevel.invalidate(),
        utils.genre.tree.children.invalidate(),
        utils.genre.tree.structure.invalidate(),
        utils.genre.searchSimple.invalidate(),
        utils.genre.history.byGenreId.invalidate({ id }),
        utils.genre.history.byUserId.invalidate(),
        utils.genre.history.userCount.invalidate(),
      ])
    },
  })
}
