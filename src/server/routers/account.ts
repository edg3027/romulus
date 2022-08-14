import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createRouter } from '../createRouter'
import { editAccount } from '../db/account'
import { EditAccountInput } from '../db/account/inputs'
import { defaultAccountSelect } from '../db/account/outputs'
import { requireLogin } from '../guards'
import { prisma } from '../prisma'

export const accountRouter = createRouter()
  .query('byId', {
    input: z.object({ id: z.number() }),
    resolve: async ({ input: { id } }) => {
      const account = await prisma.account.findUnique({
        where: { id },
        select: defaultAccountSelect,
      })

      if (!account) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No account with id '${id}'`,
        })
      }

      return account
    },
  })
  .mutation('edit', {
    input: EditAccountInput,
    resolve: async ({ input, ctx }) => {
      const { account } = requireLogin(ctx)
      if (input.id !== account.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: "Cannot edit another member's account",
        })
      }
      return editAccount(input)
    },
  })
  .query('all', {
    resolve: () => prisma.account.findMany({ select: defaultAccountSelect }),
  })
