import { withTRPC } from '@trpc/next'
import { AppType } from 'next/dist/shared/lib/utils'
import { Toaster } from 'react-hot-toast'
import {
  DefaultOptions,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { AppRouter } from '../server/routers/_app'
import { showErrorToast } from '../utils/error'
import '../../styles/globals.css'
import { useSession } from '../utils/hooks'
import { useCallback } from 'react'
import Link from 'next/link'

const queryCache = new QueryCache({
  onError: (error, query) => {
    // TODO: tell typescript that showToast is a valid option
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (query.options.showToast) {
      showErrorToast(error)
    }
  },
})

const mutationCache = new MutationCache({
  onError: (error, variables, context, mutation) => {
    // TODO: tell typescript that showToast is a valid option
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (mutation.options.showToast) {
      showErrorToast(error)
    }
  },
})

const defaultOptions: DefaultOptions = {
  // TODO: tell typescript that showToast is a valid option
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  queries: { showToast: true },

  // TODO: tell typescript that showToast is a valid option
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mutations: { showToast: true },
}

const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions,
})

const MyApp: AppType = ({ Component, pageProps }) => {
  const session = useSession()

  const renderToolbar = useCallback(() => {
    if (session.isSuccess) {
      return session.data ? (
        session.data.username
      ) : (
        <Link href='/login'>
          <a>Log in</a>
        </Link>
      )
    }

    if (session.error) {
      return (
        <Link href='/login'>
          <a>Log in</a>
        </Link>
      )
    }

    return 'Loading...'
  }, [session.data, session.error, session.isSuccess])

  return (
    <QueryClientProvider client={queryClient}>
      <div className='w-screen h-screen'>
        <div>{renderToolbar()}</div>
        <Component {...pageProps} />
        <Toaster />
      </div>
    </QueryClientProvider>
  )
}

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc'

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {
        queryCache,
        mutationCache,
        defaultOptions,
      },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp)
