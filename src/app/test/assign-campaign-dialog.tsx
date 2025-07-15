"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { trpc } from "@/app/_trpc/client"
import type { CreativeObj } from "@/schemas/assets"
import { toast } from "sonner"
import { CreativeUpdateCampaignSchema } from "@/schemas/assets"

export function AssignCampaignDialog({
  creative,
  onOpenChange,
  onSuccess,
}: {
  creative: CreativeObj
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null | undefined>(creative.campaignId)
  const { data: campaigns, isLoading: isLoadingCampaigns } = trpc.campaign.listAll.useQuery()
  const { mutateAsync: assocWithCampaign, isPending } = trpc.creative.assignCampaign.useMutation();

  const assignCampaign = async (data : CreativeUpdateCampaignSchema) => {
    try {
      assocWithCampaign(data);
      onSuccess()

    } catch(err) {
      if(err instanceof Error) {
        toast.error("Failed to assign campaign", { description: err.message })
      }else{
        toast.error("Uknown Error")
      }
    }
  }

  const handleAssign = () => {
    if (creative && selectedCampaignId) {
      assignCampaign({id: creative.id, campaignId: selectedCampaignId});
    }
  }

  return (
    <Dialog open={!!creative} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign to Campaign</DialogTitle>
          <DialogDescription>Assign the creative "{creative?.name}" to an existing campaign.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoadingCampaigns ? (
            <div className="flex items-center justify-center h-10">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <Select 
              value={selectedCampaignId ?? ""}
              onValueChange={setSelectedCampaignId}
              >
              <SelectTrigger>
                <SelectValue placeholder="Select a campaign" />
              </SelectTrigger>
              <SelectContent>
              {(campaigns ?? []).map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedCampaignId || isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

