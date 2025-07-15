import { z } from 'zod'

export const userInfoSchema = z.object({
  name: z.string().nullable()
});
