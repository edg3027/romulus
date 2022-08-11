import { TRPCClientErrorLike, UseTRPCMutationOptions } from '@trpc/react'

import { AppRouter } from '../server/routers/_app'
import { InferMutationInput, InferMutationOutput, trpc } from '../utils/trpc'

export const useGenresQuery = () => {
  const utils = trpc.useContext()
  return trpc.useQuery(['genre.all'], {
    onSuccess: (data) => {
      for (const genre of data) {
        utils.setQueryData(['genre.byId', { id: genre.id }], genre)
      }
    },
  })
}

export const useGenreQuery = (id: number) =>
  trpc.useQuery(['genre.byId', { id }])

export const useAddGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['genre.add'], {
    onSuccess: async () => {
      await Promise.all([
        utils.invalidateQueries(['genre.all']),
        utils.invalidateQueries(['genre.history.byGenreId']),
        utils.invalidateQueries(['genre.history.byUserId']),
      ])
    },
  })
}

export const useEditGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['genre.edit'], {
    onSuccess: async (data) => {
      utils.setQueryData(['genre.byId', { id: data.id }], data)
      await Promise.all([
        utils.invalidateQueries(['genre.all']),
        utils.invalidateQueries(['genre.history.byGenreId']),
        utils.invalidateQueries(['genre.history.byUserId']),
      ])
    },
  })
}

export const useDeleteGenreMutation = (
  opts?: UseTRPCMutationOptions<
    InferMutationInput<'genre.delete'>,
    TRPCClientErrorLike<AppRouter>,
    InferMutationOutput<'genre.delete'>
  >
) => {
  const utils = trpc.useContext()
  return trpc.useMutation(['genre.delete'], {
    ...opts,
    onSuccess: async (data, variables, context) => {
      await opts?.onSuccess?.(data, variables, context)
      await Promise.all([
        utils.invalidateQueries(['genre.all']),
        utils.invalidateQueries(['genre.byId', { id: variables.id }]),
        utils.invalidateQueries(['genre.history.byGenreId']),
        utils.invalidateQueries(['genre.history.byUserId']),
      ])
    },
  })
}

export const useGenreHistoryQuery = (id: number) =>
  trpc.useQuery(['genre.history.byGenreId', { id }])

export const useGenreHistoryByUserQuery = (id: number) =>
  trpc.useQuery(['genre.history.byUserId', { id }])

export const useMigrateContributorsMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['genre.history.migrateContributors'], {
    onSuccess: async () => {
      await Promise.all([
        utils.invalidateQueries(['genre.history.byGenreId']),
        utils.invalidateQueries(['genre.history.byUserId']),
      ])
    },
  })
}

export const useGiveCreateCreditMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['genre.history.giveCreateCredit'], {
    onSuccess: async (data, { accountId, genreId }) => {
      await Promise.all([
        utils.invalidateQueries(['genre.history.byGenreId', { id: genreId }]),
        utils.invalidateQueries(['genre.history.byUserId', { id: accountId }]),
      ])
    },
  })
}
