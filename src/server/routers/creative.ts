import { publicProcedure, router } from '../trpc'
import { 
  creativeFormSchema, 
  campaignSchema,
  creativeListSchema,
  creativeSchema,
  CreativeEditSchema,
  creativeUpdateCampaignSchema,
  uploadcampaignSchema,
  uploadcampaignSchemaList,
  newCampaignFormSchema,
} from '@/schemas/assets';
import { db } from '../db'
import {z} from 'zod'

export const creativeRouter = router({
  add : publicProcedure
    .input(creativeFormSchema)
    .output(creativeSchema)
    .mutation(async ({input}) => {
      const addedCreative = await db.creative.create({ 
        data: {
          id: input.id,
          name: input.name,
          tags: input.tags,
          proofOfPlay: input.proofOfPlay,

          fileUrl: input.fileUrl,
          fileType: input.fileType,
          fileSize: input.fileSize,
          width: input.width,
          height: input.height,
          duration: input.duration,

          orgId: input.orgId,
          submittedBy: input.submittedBy,
          submissionDate: input.submissionDate,
        }
      });
      const result = creativeSchema.safeParse(addedCreative);
      if (!result.success) {
        console.error(result.error.format()); // <-- clear error here
        throw new Error("Schema validation failed");
      }

      return result.data;
    }),

  delete : publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({input}) => {
      const data = await db.creative.delete({
        where: {id: input.id}
      });
      return data;
    }),

  update : publicProcedure
    .input(CreativeEditSchema)
    .mutation(async ({input}) => {
      const data = await db.creative.update({
        where: {
          id: input.id
        },
        data : {
          name: input.name,
          notes: input.notes,
          tags: input.tags,
          proofOfPlay: input.proofOfPlay,
          submissionDate: input.submissionDate,
          submittedBy: input.submittedBy
        }
      });
      return data;
    }),

  listUnassigned : publicProcedure
    .output(creativeListSchema)
    .query(async () => {
      const data = await db.creative.findMany({
        where: { campaignId: null },
        select: {
          id: true,
          name: true,
          notes: true,
          tags: true,
          approvalStatus: true,

          fileUrl: true,
          fileType: true,
          fileSize: true,
          width: true,
          height: true,
          duration: true,

          orgId: true,
          submittedBy: true,
          submissionDate: true,
        },
        orderBy: { submissionDate: 'desc' },
    });

    const result = creativeListSchema.safeParse(data);
    if (!result.success) {
      console.error(result.error.format()); // <-- clear error here
      throw new Error("Schema validation failed");
    }

    return result.data;

  }),

  listAll : publicProcedure
    .output(creativeListSchema)
    .query(async () => {
      const data = await db.creative.findMany({
        select: {
          id: true,
          name: true,
          notes: true,
          approvalStatus: true,
          tags: true,

          fileType: true,
          fileUrl: true,
          fileSize: true,
          width: true,
          height: true,
          duration: true,

          campaignId: true,
          campaign: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },

          submissionDate: true,
          submittedBy: true,
        },
        orderBy: { submissionDate: 'desc' },
      });

      const result = creativeListSchema.safeParse(data);
      if (!result.success) {
        console.error(result.error.format()); // <-- clear error here
        throw new Error("Schema validation failed");
      }
      //console.log(result.data)
      return result.data;

    }),

    assignCampaign: publicProcedure
      .input(creativeUpdateCampaignSchema)
      .mutation(async ({input}) => {
        const data = await db.creative.update({
          where: {
            id: input.id,
          },
          data: {
            campaign: {
              connect: {
                id: input.campaignId,
              },
            },
          },
        });
        console.log(data);
        return data;
    }),

    unAssignCampaign: publicProcedure
      .input(z.string())
      .mutation(async ({input}) => {
        const data = await db.creative.update({
          where: {
            id: input,
          },
          data: {
            campaign: {
              disconnect: true,
            },
          },
        });
        console.log(data);
        return data;
    }),
});


export const campaignRouter = router({
  listForSelect : publicProcedure
    .output(campaignSchema)
    .query(async () => {
      const data = await db.campaign.findMany({
        select : {
          id: true,
          name: true,
        },
      });
      const result = campaignSchema.safeParse(data);
      if (!result.success) {
        console.error(result.error.format()); // <-- clear error here
        throw new Error("Schema validation failed");
      }
      return result.data;
    }),

  listAll : publicProcedure
    .output(campaignSchema)
    .query(async () => {
      const data = await db.campaign.findMany({
        select : {
          id: true,
          name: true,
        }
      });
      console.log(data);
      return data;
    }),

    add: publicProcedure
      .input(newCampaignFormSchema)
      .mutation(async ({ input }) => {
        try {
          const res = await db.campaign.create({
            data: {
              name: input.name,
              startDate: input.startDate,
              endDate: input.endDate,
              notes: input.notes,
              userId: input.userId,
              orgId: input.orgId,
              submittedBy: input.submittedBy,
              submissionDate: input.submissionDate,
            },
          });

          return res; // ✅ must return result to avoid 500
        } catch (err) {
          console.error("❌ Campaign creation failed", err); // ✅ visible logs
          throw new Error("Internal Server Error");
        }
      }),

    listComplete: publicProcedure
      .output(uploadcampaignSchemaList)
      .query(async () => {
        const data = await db.campaign.findMany({
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            notes: true,
            userId: true,
            orgId: true,
            status: true,
            submittedBy: true,
            submissionDate: true,
          },
        });

        return data;
      }),

});
