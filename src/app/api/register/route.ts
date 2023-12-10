import { Prisma } from '@prisma/client'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { createAccount } from '../../../server/db/account'
import { sessionConfig } from '../../../server/session'
import { SessionData } from '../../../utils/session'
import { nonemptyString } from '../../../utils/validators'

const RegisterRequest = z.object({
  username: nonemptyString('Username is required'),
  password: nonemptyString('Password is required'),
})

type RegisterRequest = z.infer<typeof RegisterRequest>

export async function POST(req: Request) {
  const loginRequest = RegisterRequest.parse(await req.json())

  try {
    const account = await createAccount(loginRequest)

    const session = await getIronSession<SessionData>(cookies(), sessionConfig)
    session.accountId = account.id
    await session.save()

    return Response.json({ accountId: account.id })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return new Response(
        'Could not create account. Username already exists.',
        { status: 409 }
      )
    }

    return new Response('Could not create account.', { status: 500 })
  }
}
