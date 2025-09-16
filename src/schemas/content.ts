import { ContentType } from '@prisma/client'
import { z } from 'zod'
import { creativeSchema, designSchema, playlistSchema } from './assets';

export const contentBaseSchema = z.object({
    id: z.string(),
    type: z.nativeEnum(ContentType),
    objId: z.string(),
    scheduleIds: z.array(z.string()),
    orgId: z.string(),
})

export type contentBase = z.infer<typeof contentBaseSchema>

export const contentRelationalSchema = z.object({
    id: z.string(),
    type: z.nativeEnum(ContentType),

    creativeId: z.string().optional(),
    creative: z.lazy(()=>creativeSchema).optional(),

    playlistId: z.string().optional(),
    playlist: z.lazy(()=>playlistSchema).optional(),

    designId: z.string().optional(),
    design: z.lazy(()=>designSchema).optional(),

    orgId: z.string(),
})
