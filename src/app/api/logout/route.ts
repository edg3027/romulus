import { getSession } from '../../../server/session'

export async function POST() {
  const session = await getSession()
  session.destroy()
  return Response.json({ accountId: null })
}
