import isISO8601_ from 'validator/lib/isISO8601'
import { z } from 'zod'

export const nonemptyString = (message?: string) =>
  z.string().trim().min(1, message)

export const isISO8601 = isISO8601_

export const iso8601 = () =>
  nonemptyString().refine((val) => isISO8601(val), {
    message: 'Must be a valid ISO 8601 string',
  })

export const check = <T>(
  schema: z.ZodType<T, z.ZodTypeDef, T>,
  candidate: unknown,
): candidate is T => schema.safeParse(candidate).success
