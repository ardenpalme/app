"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CreativeStatusBadge } from "@/components/status-badges"
import { CreativeObj, CreativeList } from "@/schemas/assets"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDisplayDate } from "@/lib/utils"

export function CreativeTableView({
  creatives,
  onViewDetails,
}: {
  creatives: CreativeList
  onViewDetails: (creative: CreativeObj) => void
}) {
  if (creatives.length === 0) {
    return <div className="text-center text-muted-foreground py-24">No creatives found.</div>
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Preview</TableHead>
            <TableHead>Creative Name</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creatives.map((creative) => (
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
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onViewDetails(creative)}>View Details</DropdownMenuItem>
                    <DropdownMenuItem disabled={!creative.campaignId}>View Campaign</DropdownMenuItem>
                    <DropdownMenuItem>Download Asset</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

