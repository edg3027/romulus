import { env } from './env'
import { SessionOptions } from 'iron-session'

export const sessionConfig: SessionOptions = {
  cookieName: 'romulus-auth',
  password: env.AUTH_PASSWORD,
  cookieOptions: { secure: env.NODE_ENV === 'production' },
  ttl: 0,
}
