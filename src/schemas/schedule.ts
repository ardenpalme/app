import {z} from 'zod'
import { contentRelationalSchema } from './content'

export const scheduleBaseSchema = z.object({
  id: z.string(),
  start: z.date(),
  end: z.date(),
  isInf: z.boolean(),
  contentId: z.string()
})

export const scheduleRelationalSchema = z.object({
  id: z.string(),
  start: z.date(),
  end: z.date(),
  isInf: z.boolean(),
  content: z.lazy(()=>contentRelationalSchema),
  contentId: z.string()
})

