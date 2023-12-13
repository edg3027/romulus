'use client'

import { DefaultAccount } from '../server/db/account/outputs'
import { ReactNode, createContext, useContext, useMemo } from 'react'

export type ServerAccountContext = {
  account: DefaultAccount | null
}

const ServerAccountContext = createContext<ServerAccountContext>({
  account: null,
})

export const ServerAccountProvider = ({
  children,
  account,
}: {
  children: ReactNode
  account: DefaultAccount | null
}) => {
  const value = useMemo(() => ({ account }), [account])
  return (
    <ServerAccountContext.Provider value={value}>
      {children}
    </ServerAccountContext.Provider>
  )
}

export const useServerAccount = () => useContext(ServerAccountContext)
