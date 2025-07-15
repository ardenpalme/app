"use client"

import { useState } from "react"
import { trpc } from "@/app/_trpc/client"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddAssetDialog } from "./add-assets-dialog"
import { CreativeLibrary } from "./creative-library"

export default function CreativesPage() {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false)
  const { data: allCreatives, isLoading: isLoadingCreatives, refetch } = trpc.creative.listAll.useQuery()
  const { data: campaignsForFilter, isLoading: isLoadingCampaigns } = trpc.campaign.listForSelect.useQuery()

  const handleUploadSuccess = () => {
    refetch()
    setUploadDialogOpen(false)
  }

  if (isLoadingCreatives || isLoadingCampaigns) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    )
  }
  console.log("top page: creative", allCreatives);
  console.log("top page: campaign", campaignsForFilter);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creative Library</h1>
          <p className="text-muted-foreground">Browse and manage all creative assets across your campaigns.</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Creative
        </Button>
      </div>
      <CreativeLibrary creatives={allCreatives} campaigns={campaignsForFilter} onActionSuccess={() => {refetch()}}/>
      <AddAssetDialog
        open={isUploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadSuccess={handleUploadSuccess}
        mode="default"
      />
    </div>
  )
}

