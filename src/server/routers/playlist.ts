import { publicProcedure, router } from '../trpc'
import { db } from '../db'
import {z} from 'zod'
import {
  playlistSchema,
  playlistSchemaList
} from '@/schemas/assets';

// link to the assets in Creative DB by id
export const playlistRouter = router({
  add : publicProcedure
    .input(playlistSchema)
    .mutation(async ({input}) => {
      db.creative
      const res = db.playlist.create({
        data: {
          id: input.id,
          name: input.name,
          durationSec: input.durationSec,
          assets: {
            connect: input.assets.map(asset => ({ id: asset.id })),
          },
          orgId: input.orgId,
        }
      });
      return res;
    }),

  delete : publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({input}) => {
      const data = await db.playlist.delete({
        where: {id: input.id}
      });
      return data;
    }),

  listAll : publicProcedure
    .output(playlistSchemaList)
    .query(async () => {
      const data = await db.playlist.findMany({
        select: {
          id: true,
          name: true,
          durationSec: true,
          assets: true,
          orgId: true,
        }
      });

      return data;
    }),

  upsert : publicProcedure
    .input(playlistSchema)
    .mutation(async ({input}) => {
      const ids = input.assets.map(asset => ({ id: asset.id }))
      const data = await db.playlist.upsert({
        where: { id: input.id },
        create : {
          id: input.id,
          name: input.name,
          durationSec: input.durationSec,
          assets: { connect: ids},
          orgId: input.orgId
        },
        update : {
          name: input.name,
          durationSec: input.durationSec,
          assets: { connect: ids},
        }
      });
      return data;
    }),
})

