import { z } from 'zod'
import { CreativeApprovalStatus, CampaignStatus } from '@prisma/client'

export const creativeFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  notes: z.string().nullable(),
  tags: z.array(z.string()),
  proofOfPlay: z.boolean(),

  fileUrl: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.float64().optional(),

  // TODO add created At support here
  orgId: z.string(),
  submittedBy: z.string(),
  submissionDate: z.date(),
});
export type CreativeForm = z.infer<typeof creativeFormSchema>

export const creativeSchema = z.object({
  id: z.string(),
  name: z.string(),
  notes: z.string().nullable().optional(),
  tags: z.array(z.string()),
  approvalStatus: z.enum(CreativeApprovalStatus), 

  fileUrl: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.float64().optional(),

  campaignId: z.string().optional().nullable(),
  campaign: z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(CampaignStatus), 
  }).optional().nullable(),

  submittedBy: z.string(),
  submissionDate: z.date(),
});
export type CreativeObj = z.infer<typeof creativeSchema>

export const creativeListSchema = z.array(creativeSchema);
export type CreativeList = z.infer<typeof creativeListSchema>

export const unassignedCreativeListSchema = z.array(creativeSchema);
export type unassignedCreativeList = z.infer<typeof unassignedCreativeListSchema>

export const campaignSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
}))
.optional()
.nullable(); // TODO check listForSelect
export type CampaignList = z.infer<typeof campaignSchema>


export const mediaMetadataSchema = z.object({
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.number().optional(),
})
export type MediaMetadata = z.infer<typeof mediaMetadataSchema>

export const CreativeEditSchema = z.object({
  id: z.string(),
  name: z.string(),
  notes: z.string().nullable(),
  tags: z.array(z.string()),
  //upadted by is set by prisma - NOTE
});


export const creativeUpdateCampaignSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
});
export type CreativeUpdateCampaignSchema = z.infer<typeof creativeUpdateCampaignSchema>


export const newCampaignFormSchema = z.object({
  name: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  notes: z.string().nullable(),
  userId: z.string(),
  orgId: z.string(),
  submittedBy: z.string(),
  submissionDate: z.date(),
});

export type NewCampaignFormSchema = z.infer<typeof newCampaignFormSchema>

export const uploadcampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  notes: z.string().nullable(), 
  userId: z.string(),
  orgId: z.string(),
  status: z.enum(CampaignStatus),

  creatives: z.array(creativeSchema).optional().nullable(),

  submittedBy: z.string().nullable(),
  submissionDate: z.date().nullable(),
});
export type UploadCampaignSchema = z.infer<typeof uploadcampaignSchema>

export const uploadcampaignSchemaList = z.array(uploadcampaignSchema)
export type UploadCampaignSchemaList = z.infer<typeof uploadcampaignSchemaList>

export type CampaignObj = z.infer<typeof uploadcampaignSchema>



