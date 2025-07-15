"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CreativeStatusBadge } from "@/components/status-badges"
import { CreativeObj, CreativeList } from "@/schemas/assets"
import { Ellipsis, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDisplayDate } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function CreativeTableView({
  creatives,
  onEdit,
  onDelete,
  onAddToCampaign,
}: {
  creatives: CreativeList
  onEdit: (creative: CreativeObj ) => void
  onDelete: (creative: CreativeObj ) => void
  onAddToCampaign: (creative: CreativeObj ) => void
}) {
  if (creatives.length === 0) {
    return <div className="text-center text-muted-foreground py-24">No creatives found.</div>
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">Preview</TableHead>
            <TableHead>Creative Name</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creatives.map((creative) => (
          <ContextMenu key={creative.id}>
            <ContextMenuTrigger asChild>
              <TableRow key={creative.id}>
                <TableCell>
                  <div className="aspect-video w-20 overflow-hidden rounded-md bg-muted">
                    <img
                      src={creative.fileUrl ? `/api/r2/${creative.fileUrl}` : "/placeholder.svg"}
                      alt={creative.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{creative.name}</TableCell>
                <TableCell className="text-muted-foreground">{creative.campaign?.name || "Unassigned"}</TableCell>
                <TableCell className="text-muted-foreground">{creative.submittedBy || "-"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {creative.submissionDate ? formatDisplayDate(creative.submissionDate, "PP") : "-"}
                </TableCell>
                <TableCell>
                  <CreativeStatusBadge status={creative.approvalStatus} />
                </TableCell>
              </TableRow>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => onEdit(creative)}>Edit</ContextMenuItem>
              <ContextMenuItem onClick={() => onDelete(creative)}>Delete</ContextMenuItem>
              <ContextMenuItem onClick={() => onAddToCampaign(creative)}>Assign To Campaign</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

