import { getAccountById } from './db/account'
import { env } from './env'
import { SessionOptions, getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export const sessionConfig: SessionOptions = {
  cookieName: 'romulus-auth',
  password: env.AUTH_PASSWORD,
  cookieOptions: { secure: env.NODE_ENV === 'production' },
  ttl: 0,
}

export type SessionData = { accountId?: number }

export const getSession = () =>
  getIronSession<SessionData>(cookies(), sessionConfig)

export const getSessionWithAccount = async () => {
  const session = await getSession()

  const account =
    session.accountId === undefined
      ? null
      : await getAccountById(session.accountId)

  return { session, account }
}
