import { SessionOptions } from 'iron-session'

import { env } from './env'

export const sessionConfig: SessionOptions = {
  cookieName: 'romulus-auth',
  password: env.AUTH_PASSWORD,
  cookieOptions: { secure: env.NODE_ENV === 'production' },
  ttl: 0,
}
