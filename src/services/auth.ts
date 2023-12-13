import { useServerAccount } from '../hooks/useServerAccount'
import { trpc } from '../utils/trpc'
import { useAccountQuery } from './accounts'
import { Permission } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import ky from 'ky'
import { useCallback, useMemo } from 'react'

export const useWhoamiQuery = () =>
  trpc.auth.whoami.useQuery(undefined, { staleTime: 60 * 1000 })

export const useSession = () => {
  const whoamiQuery = useWhoamiQuery()
  const accountQuery = useAccountQuery(whoamiQuery.data?.id)
  const { account: serverAccount } = useServerAccount()

  const isLoggedIn = useMemo(() => {
    if (!whoamiQuery.isSuccess) return undefined
    return whoamiQuery.data !== null
  }, [whoamiQuery.data, whoamiQuery.isSuccess])

  const isLoggedOut = useMemo(() => {
    if (!whoamiQuery.isSuccess) return undefined
    return whoamiQuery.data === null
  }, [whoamiQuery.data, whoamiQuery.isSuccess])

  const hasPermission = useCallback(
    (permission: Permission) =>
      accountQuery.data?.permissions.includes(permission),
    [accountQuery.data?.permissions],
  )

  const account = useMemo(() => {
    if (whoamiQuery.data === null) return null

    if (accountQuery.isSuccess) {
      return accountQuery.data
    }

    return serverAccount
  }, [
    accountQuery.data,
    accountQuery.isSuccess,
    serverAccount,
    whoamiQuery.data,
  ])

  return {
    account,
    error: whoamiQuery.error ?? accountQuery.error,
    isLoggedIn,
    isLoggedOut,
    hasPermission,
  }
}

export const useLoginMutation = () => {
  const utils = trpc.useUtils()
  return useMutation(
    ({ username, password }: { username: string; password: string }) =>
      ky.post('/api/login', { json: { username, password } }),
    {
      onSuccess: async () => {
        await utils.auth.whoami.invalidate()
      },
    },
  )
}

export const useRegisterMutation = () => {
  const utils = trpc.useUtils()
  return useMutation(
    ({ username, password }: { username: string; password: string }) =>
      ky.post('/api/register', { json: { username, password } }),
    {
      onSuccess: async () => {
        await utils.auth.whoami.invalidate()
      },
    },
  )
}

export const useLogoutMutation = () => {
  const utils = trpc.useUtils()
  return useMutation(() => ky.post('/api/logout'), {
    onSuccess: async () => {
      await utils.auth.whoami.invalidate()
    },
  })
}
