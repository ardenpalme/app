"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreativeEditForm } from "@/app/_components/creative-edit-form"
import { AssignCampaignDialog } from "@/app/_components/assign-campaign-dialog"
import { CreativeList, CreativeObj, CampaignList, UploadCampaignSchemaList, CampaignObj, UploadCampaignSchema } from "@/schemas/assets"
import { LayoutGrid, List, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { trpc } from "../_trpc/client"
import { CreateCampaignDialog } from "@/app/_components/create-campaign-dialog"
import { Campaign, Creative } from "@prisma/client"
import { deleteFileFromWorker } from "@/lib/r2-worker"
import { AddAssetDialog } from "@/app/_components/add-assets-dialog"
import { CreativeTableView } from "../creatives/creative-table-view"
import { CampaignTableView } from "./campaign-table-view"

export function CampaignLibrary({
  campaigns,
  onActionSuccess
}: {
  campaigns: UploadCampaignSchemaList 
  onActionSuccess: () => void
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const [editCreative, setEditCreative] = useState<CreativeObj | null>(null)
  const [deleteCreative, setDeleteCreative] = useState<CreativeObj | null>(null)

  const [createNewCamp, setCreateNewCamp] = useState<boolean>(false)
  const [deleteCampaign, setDeleteCampaign] = useState<UploadCampaignSchema | null>(null)
  const [editCampaign, setEditCampaign] = useState<UploadCampaignSchema | null>(null)

  const { mutateAsync: delCamp } = trpc.creative.delete.useMutation()
  const { mutateAsync: delCrea } = trpc.creative.delete.useMutation()
  const { mutateAsync: unassignCrea } = trpc.creative.unAssignCampaign.useMutation()

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
  }, [campaigns, searchTerm])


  const handleEditCamp = (campaign: UploadCampaignSchema) => {
    setEditCampaign(campaign)
  }

  const handleEditCrea = (creative: CreativeObj) => {
    setEditCreative(creative)
  }

  const handleUnassignCrea = (creative : CreativeObj) => {
    unassignCrea(creative.id)
  }

  const handleDeleteCrea = (creative : CreativeObj) => {
    setDeleteCreative(creative)
  }
  const handleConfirmDeleteCrea = async () => {
    if(deleteCreative) {
      delCrea({id: deleteCreative.id});
      deleteFileFromWorker(deleteCreative.fileUrl);
    }
    onActionSuccess()
  }

  const handleDeleteCamp = (campaign : UploadCampaignSchema) => {
    setDeleteCampaign(campaign)
  }
  const handleConfirmDeleteCamp = async () => {
    if(deleteCampaign) {
      for (const creative of deleteCampaign.creatives ?? []) {
        unassignCrea(creative.id);
      }
      delCamp(deleteCampaign)
    }
    onActionSuccess()
  }

  const resetFilters = () => {
    setSearchTerm("")
  }
  const areFiltersActive = searchTerm !== "all"

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 flex items-center gap-2">
            <Input
              placeholder="Search by creative or campaign name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            {areFiltersActive && (
              <Button variant="ghost" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <ScrollArea className="max-h-[60vh] overflow-auto">
        <CampaignTableView 
          campaigns={filteredCampaigns} 
          onDeleteCamp={handleDeleteCamp}
          onDeleteCrea={handleDeleteCrea}
          onEditCamp={handleEditCamp} 
          onEditCrea={handleEditCrea} 
          onUnassignCrea={handleUnassignCrea}
          /> 
      </ScrollArea>

      <Dialog open={!!editCreative} onOpenChange={(isOpen) => !isOpen && setEditCreative(null)}>
        <DialogContent className="max-w-4xl">
          {editCreative && (
            <>
              <DialogHeader>
                <DialogTitle>{editCreative.name}</DialogTitle>
              </DialogHeader>
              <CreativeEditForm creative={editCreative} onSuccess={() => {console.log("TODO handleEditCreaSuccess")}}/>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCreative} onOpenChange={(isOpen) => !isOpen && setDeleteCreative(null)}>
        <AlertDialogContent>
          {deleteCreative && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the creative "{deleteCreative?.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDeleteCrea}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteCampaign} onOpenChange={(isOpen) => !isOpen && setDeleteCampaign(null)}>
        <AlertDialogContent>
          {deleteCampaign && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the campaign "{deleteCampaign?.name}" and unassign all of its creatives.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDeleteCamp}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}


