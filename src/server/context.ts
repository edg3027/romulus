import * as trpcNext from '@trpc/server/adapters/next'
import { getIronSession } from 'iron-session'

import { SessionData } from '../utils/session'
import { getAccountById } from './db/account'
import { DefaultAccount } from './db/account/outputs'
import { sessionConfig } from './session'

export type Context = {
  account: DefaultAccount | null
}

export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  const session = await getIronSession<SessionData>(
    opts.req,
    opts.res,
    sessionConfig
  )

  const account =
    session.accountId !== undefined
      ? await getAccountById(session.accountId)
      : null

  return { account }
}
