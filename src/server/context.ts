import { SessionData } from '../utils/session'
import { getAccountById } from './db/account'
import { DefaultAccount } from './db/account/outputs'
import { sessionConfig } from './session'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export type Context = {
  account: DefaultAccount | null
}

export async function createContext(): Promise<Context> {
  const session = await getIronSession<SessionData>(cookies(), sessionConfig)

  const account =
    session.accountId === undefined
      ? null
      : await getAccountById(session.accountId)

  return { account }
}
