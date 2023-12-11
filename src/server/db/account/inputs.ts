import { nonemptyString } from '../../../utils/validators'
import { GenreRelevanceInput } from '../common/inputs'
import { z } from 'zod'

export const CreateAccountInput = z.object({
  username: nonemptyString('Username is required'),
  password: nonemptyString('Password is required'),
})
export type CreateAccountInput = z.infer<typeof CreateAccountInput>

export const EditAccountInput = z.object({
  id: z.number(),
  data: z.object({
    genreRelevanceFilter: GenreRelevanceInput.optional(),
    showTypeTags: z.boolean().optional(),
    showRelevanceTags: z.boolean().optional(),
  }),
})
export type EditAccountInput = z.infer<typeof EditAccountInput>
