import { sessionConfig } from '../../../server/session'
import { SessionData } from '../../../utils/session'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export async function POST() {
  const session = await getIronSession<SessionData>(cookies(), sessionConfig)
  session.destroy()
  return Response.json({ accountId: null })
}
