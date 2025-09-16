import { publicProcedure, router } from '../trpc'
import { db } from '../db'
import {z} from 'zod'
import { contentBaseSchema, contentRelationalSchema } from '@/schemas/content';

export const contentRouter = router({
  delete : publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({input}) => {
      const data = await db.content.delete({
        where: {id: input.id}
      });
      return data;
    }),

  listUnique : publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .output(contentRelationalSchema )
    .query(async ({input}) => {
      const data = await db.content.findUnique({
        where : {id: input.id},
        select : {
          schedules: false
        }
      });

      return data;
    }),

  upsert : publicProcedure
    .input(contentBaseSchema)
    .mutation(async ({input}) => {
      const ids = input.scheduleIds.map((Id)=>({id: Id}))
      console.log(">>>", ids)
      if(input.type == 'CREATIVE') {
        const data = await db.content.upsert({
          where: { id: input.id },
          create : {
            id: input.id,
            type: input.type,
            creative: { connect: {id: input.objId}},
            orgId: input.orgId,
            schedules:  {connect: ids}
          },
          update : {
            type: input.type,
            creative: { connect: {id: input.objId}},
            schedules:  {set: ids}
          }
        });
        return data;
      } else if(input.type == 'DESIGN') {
        const data = await db.content.upsert({
          where: { id: input.id },
          create : {
            id: input.id,
            type: input.type,
            design: { connect: {id: input.objId}},
            orgId: input.orgId,
            schedules:  {connect: ids}
          },
          update : {
            type: input.type,
            design: { connect: {id: input.objId}},
            schedules:  {set: ids}
          }
        });
        return data;
      } else if(input.type == 'PLAYLIST') {
        const data = await db.content.upsert({
          where: { id: input.id },
          create : {
            id: input.id,
            type: input.type,
            playlist: { connect: {id: input.objId}},
            orgId: input.orgId,
            schedules:  {connect: ids}
          },
          update : {
            type: input.type,
            playlist: { connect: {id: input.objId}},
            schedules:  {set: ids}
          }
        });
        return data;
      } else {
        throw new Error("invalid content type")
      }
    }),
})


