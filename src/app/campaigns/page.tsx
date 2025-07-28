"use client"

import { useState, useMemo } from "react"
import { trpc } from "@/app/_trpc/client"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CampaignLibrary } from "./campaign-library"
import { CreateCampaignDialog } from "../_components/create-campaign-dialog"

export default function campaignsPage() {
  const [isNewCampDiagOpen, setNewCampDiagOpen] = useState(false)

  const { data: campaigns, isLoading: isLoadingCampaigns, refetch } = trpc.campaign.listComplete.useQuery()
  const { data: creatives, isLoading: isLoadingCreatives, } = trpc.creative.listAll.useQuery();
  
  const fullCampaigns = useMemo(() => {
    if (!campaigns?.length || !creatives?.length) return [];

    return campaigns.map((campaign) => ({
      ...campaign,
      creatives: creatives.filter((creative) => creative.campaignId === campaign.id),
    }));
  }, [campaigns, creatives]);

  const handleCampDiagOpen = () => {
    refetch()
    setNewCampDiagOpen(false)
  }

  if (isLoadingCampaigns || isLoadingCreatives) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Manager</h1>
          <p className="text-muted-foreground">Create and configure ad campaigns using the media library</p>
        </div>
        <Button onClick={() => setNewCampDiagOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New
        </Button>
      </div>
      <CampaignLibrary campaigns={fullCampaigns} onActionSuccess={() => {refetch()}}/>
      <CreateCampaignDialog 
        open={isNewCampDiagOpen}
        onOpenChange={setNewCampDiagOpen}
        onSuccess={handleCampDiagOpen}
        />
    </div>
  )
}


