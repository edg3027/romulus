'use client'

import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient, trpc, trpcReact } from '../utils/trpc'

export function ClientProviders(props: { children: React.ReactNode }) {
  return (
    <trpc.Provider client={trpcReact} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
