import { trpc } from '../utils/trpc'

export const useArtistsQuery = () => trpc.artist.all.useQuery()

export const useArtistQuery = (id: number) => trpc.artist.byId.useQuery({ id })

export const useAddArtistMutation = () => {
  const utils = trpc.useUtils()
  return trpc.artist.add.useMutation({
    onSuccess: (data) =>
      Promise.all([
        utils.artist.all.invalidate(),
        utils.artist.byId.setData({ id: data.id }, data),
      ]),
  })
}

export const useDeleteArtistMutation = () => {
  const utils = trpc.useUtils()
  return trpc.artist.delete.useMutation({
    onSuccess: (data) =>
      Promise.all([
        utils.artist.all.invalidate(),
        utils.artist.byId.invalidate({ id: data.id }),
      ]),
  })
}
