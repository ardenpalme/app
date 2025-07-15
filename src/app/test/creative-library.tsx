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
import { CreativeGalleryView } from "@/app/test/creative-gallery-view"
import { CreativeTableView } from "@/app/test/creative-table-view"
import { CreativeEditForm } from "@/app/test/creative-edit-form"
import { AssignCampaignDialog } from "@/app/test/assign-campaign-dialog"
import { CreativeList, CreativeObj, CampaignList } from "@/schemas/assets"
import { LayoutGrid, List, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { trpc } from "../_trpc/client"
import { deleteFileFromWorker } from "@/lib/r2-worker"

export function CreativeLibrary({
  creatives,
  campaigns,
  onActionSuccess
}: {
  creatives: CreativeList
  campaigns: CampaignList
  onActionSuccess: () => void
}) {
  const [view, setView] = useState<"gallery" | "table">("gallery")
  const [searchTerm, setSearchTerm] = useState("")
  const [campaignFilter, setCampaignFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editCreative, setEditCreative] = useState<CreativeObj | null>(null)
  const [assignCreative, setAssignCreative] = useState<CreativeObj | null>(null)
  const [deleteCreative, setDeleteCreative] = useState<CreativeObj | null>(null)

  const filteredCreatives = useMemo(() => {
    return creatives.filter((creative) => {
      const campaignName = creative.campaign?.name || ""

      const matchesSearch =
        creative.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaignName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCampaign =
        campaignFilter === "all" ||
        (campaignFilter !== "all" && creative.campaignId === campaignFilter)

      const matchesStatus =
        statusFilter === "all" || creative.approvalStatus === statusFilter

      return matchesSearch && matchesCampaign && matchesStatus
    })
  }, [creatives, searchTerm, campaignFilter, statusFilter])



  const handleEdit = (creative: CreativeObj) => {
    setEditCreative(creative)
  }

  const handleEditSuccess = () => {
    setEditCreative(null)
    onActionSuccess() 
  }

  const handleDelete = async (creative: CreativeObj) => {
    setDeleteCreative(creative)
  }

  const { mutateAsync: del } = trpc.creative.delete.useMutation()

  const handleConfirmDelete = async () => {
    if(deleteCreative) {
      const data = await del({id: deleteCreative.id});
      deleteFileFromWorker(deleteCreative.fileUrl);
    }
    onActionSuccess()
  }

  const resetFilters = () => {
    setSearchTerm("")
    setCampaignFilter("all")
    setStatusFilter("all")
  }

  const areFiltersActive = searchTerm !== "" || campaignFilter !== "all" || statusFilter !== "all"

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Input
            placeholder="Search by creative or campaign name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex-1 flex items-center gap-2">
            <Select value={campaignFilter} onValueChange={setCampaignFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {(campaigns ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id || "-"}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            {areFiltersActive && (
              <Button variant="ghost" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === "gallery" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("gallery")}
              aria-label="Gallery View"
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant={view === "table" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("table")}
              aria-label="Table View"
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      <ScrollArea className="max-h-[60vh] overflow-auto">
      {view === "gallery" ? (
        <CreativeGalleryView 
          creatives={filteredCreatives} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          onAddToCampaign={setAssignCreative}
          />
      ) : (
        <CreativeTableView 
          creatives={filteredCreatives} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          onAddToCampaign={setAssignCreative}
          /> 
      )}
      </ScrollArea>

      <Dialog open={!!editCreative} onOpenChange={(isOpen) => !isOpen && setEditCreative(null)}>
        <DialogContent className="max-w-4xl">
          {editCreative && (
            <>
              <DialogHeader>
                <DialogTitle>{editCreative.name}</DialogTitle>
              </DialogHeader>
              <CreativeEditForm creative={editCreative} onSuccess={handleEditSuccess}/>
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
                <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!assignCreative} onOpenChange={(isOpen) => !isOpen && setAssignCreative(null)}>
        <DialogContent className="max-w-4xl">
          {assignCreative && (
            <AssignCampaignDialog 
              creative={assignCreative} 
              onOpenChange={() => setAssignCreative(null)}
              onSuccess={() => {
                setAssignCreative(null)
                onActionSuccess()
              }}
              /> 
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

