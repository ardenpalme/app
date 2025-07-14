import { publicProcedure, router } from '../trpc'
import { 
  creativeFormSchema, 
  campaignSchema,
  creativeListSchema,
  creativeSchema,
} from '@/schemas/assets';
import { db } from '../db'

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
});
