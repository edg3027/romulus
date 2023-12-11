import { prisma } from '../../../server/prisma'
import { sessionConfig } from '../../../server/session'
import { SessionData } from '../../../utils/session'
import { nonemptyString } from '../../../utils/validators'
import bcrypt from 'bcrypt'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { z } from 'zod'

const LoginRequest = z.object({
  username: nonemptyString('Username is required'),
  password: nonemptyString('Password is required'),
})

type LoginRequest = z.infer<typeof LoginRequest>

export async function POST(req: Request) {
  const loginRequest = LoginRequest.parse(await req.json())

  const account = await prisma.account.findUnique({
    where: { username: loginRequest.username },
    select: { id: true, password: true },
  })

  if (
    !account ||
    !(await bcrypt.compare(loginRequest.password, account.password))
  ) {
    return new Response('Invalid email or password', { status: 401 })
  }

  const session = await getIronSession<SessionData>(cookies(), sessionConfig)
  session.accountId = account.id
  await session.save()

  return Response.json({ accountId: account.id })
}
