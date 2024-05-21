import { type Actions, redirect } from '@sveltejs/kit'
import Postgres from 'postgres'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'

import { hashPassword, lucia } from '$lib/server/auth'
import { db } from '$lib/server/db'
import { accounts } from '$lib/server/db/schema'

import type { PageServerLoad } from './$types'

const schema = z
  .object({
    username: z.string().min(3).max(72),
    password: z.string().min(8).max(72),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session) {
    return redirect(302, '/')
  }

  const form = await superValidate(zod(schema))
  return { form }
}

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(schema))

    if (!form.valid) {
      return fail(400, { form })
    }

    let account
    try {
      ;[account] = await db
        .insert(accounts)
        .values({
          username: form.data.username,
          password: await hashPassword(form.data.password),
        })
        .returning()
    } catch (error) {
      if (
        error instanceof Postgres.PostgresError &&
        error.code === '23505' &&
        error.constraint_name === 'Account_username_unique'
      ) {
        return setError(form, 'username', 'Username is already taken')
      }
      throw error
    }

    const session = await lucia.createSession(account.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    })

    redirect(302, '/genres')
  },
}
