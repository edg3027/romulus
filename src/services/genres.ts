import { Sort } from '../server/db/genre/inputs'
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
  const utils = trpc.useUtils()
  return trpc.genre.allSimple.useQuery(undefined, {
    staleTime: Number.POSITIVE_INFINITY,
    onSuccess: (data) => {
      void Promise.all(
        data.map((genre) =>
          utils.genre.byIdSimple.setData({ id: genre.id }, genre)
        )
      )
    },
  })
}

export const useSimpleGenreSearchQuery = (query: string) => {
  return trpc.genre.searchSimple.useQuery({ query })
}

export const useGenreQuery = (id: number) => {
  const utils = trpc.useUtils()
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
      staleTime: Number.POSITIVE_INFINITY,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      showToast: options.showToast,
    }
  )

export const useAddGenreMutation = () => {
  const utils = trpc.useUtils()
  return trpc.genre.add.useMutation({
    onSuccess: async (data) => {
      utils.genre.byId.setData({ id: data.id }, data)
      utils.genre.byIdSimple.setData({ id: data.id }, data)
      await Promise.all([
        utils.genre.paginated.invalidate(),
        utils.genre.searchSimple.invalidate(),
        utils.genre.allSimple.invalidate(),
        utils.genre.history.byGenreId.invalidate(),
        utils.genre.history.byUserId.invalidate(),
        utils.genre.history.userCount.invalidate(),
      ])
    },
  })
}

export const useEditGenreMutation = () => {
  const utils = trpc.useUtils()
  return trpc.genre.edit.useMutation({
    onSuccess: async (data) => {
      utils.genre.byId.setData({ id: data.id }, data)
      utils.genre.byIdSimple.setData({ id: data.id }, data)
      await Promise.all([
        utils.genre.paginated.invalidate(),
        utils.genre.searchSimple.invalidate(),
        utils.genre.allSimple.invalidate(),
        utils.genre.history.byGenreId.invalidate(),
        utils.genre.history.byUserId.invalidate(),
        utils.genre.history.userCount.invalidate(),
      ])
    },
  })
}

export const useDeleteGenreMutation = () => {
  const utils = trpc.useUtils()
  return trpc.genre.delete.useMutation({
    onSuccess: async (data, { id }) => {
      await Promise.all([
        utils.genre.paginated.invalidate(),
        utils.genre.searchSimple.invalidate(),
        utils.genre.allSimple.invalidate(),
        utils.genre.history.byGenreId.invalidate({ id }),
        utils.genre.history.byUserId.invalidate(),
        utils.genre.history.userCount.invalidate(),
      ])
    },
  })
}
