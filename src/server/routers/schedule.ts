import { publicProcedure, router } from '../trpc'
import { db } from '../db'
import {z} from 'zod'
import { scheduleSchema } from '@/schemas/schedule';

export const scheduleRouter = router({
  delete : publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({input}) => {
      const data = await db.schedule.delete({
        where: {id: input.id}
      });
      return data;
    }),

  listUnique : publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .output(scheduleSchema)
    .query(async ({input}) => {
      const data = await db.schedule.findUnique({
        where : {id: input.id}
      });

      return data;
    }),

  upsert : publicProcedure
    .input(contentSchema)
    .mutation(async ({input}) => {
      const schedule_ids = input.schedules.map(schedule => ({ id: schedule.id }))
      if(input.type == 'CREATIVE') {
        const data = await db.content.upsert({
          where: { id: input.id },
          create : {
            id: input.id,
            type: input.type,
            creative: { connect: {id: input.objId}},
            orgId: input.orgId,
            schedules:  {connect: schedule_ids}
          },
          update : {
            type: input.type,
            creative: { connect: {id: input.objId}},
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
            schedules:  {connect: schedule_ids}
          },
          update : {
            type: input.type,
            design: { connect: {id: input.objId}},
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
            schedules:  {connect: schedule_ids}
          },
          update : {
            type: input.type,
            playlist: { connect: {id: input.objId}},
          }
        });
        return data;
      } else {
        throw new Error("invalid content type")
      }
    }),
})


