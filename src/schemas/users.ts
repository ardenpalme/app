import { z } from 'zod'

export const userFormSchema = z.object({
  name: z.number(),
  email: z.string().email(),
});


