"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CampaignStatusBadge, CreativeStatusBadge } from "@/components/status-badges"
import { CreativeObj, CreativeList, UploadCampaignSchemaList, CampaignObj, UploadCampaignSchema } from "@/schemas/assets"
import { Check, ChevronDown, ChevronUp, CirclePlus, Ellipsis, MoreHorizontal, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDisplayDate } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

export function CampaignTableView({
  campaigns,
  onDeleteCamp,
  onEditCamp,
  onEditCrea,
  onDeleteCrea,
  onUnassignCrea,
}: {
  campaigns: UploadCampaignSchemaList
  onDeleteCamp: (campaign: UploadCampaignSchema) => void
  onEditCamp: (campaign: UploadCampaignSchema) => void
  onDeleteCrea: (creative: CreativeObj ) => void
  onUnassignCrea: (creative: CreativeObj) => void
  onEditCrea: (creative: CreativeObj) => void
}) {
  if (campaigns.length === 0) {
    return <div className="text-center text-muted-foreground py-24">No Campaigns found.</div>
  }

  const [openRow, setOpenRow] = useState("")

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead></TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <>
              <TableRow
                key={campaign.id}
              >
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{campaign.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {campaign.submittedBy || "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {campaign.submissionDate
                    ? formatDisplayDate(campaign.submissionDate, "PP")
                    : "-"}
                </TableCell>
                <TableCell>
                  <CampaignStatusBadge status={campaign.status} />
                </TableCell>
                <TableCell>

                {openRow == campaign.id ? (
                  <Button
                    className="cursor-pointer"
                    onClick={() => setOpenRow(openRow === campaign.id ? "" : campaign.id)}
                    variant="ghost"
                  >
                    <ChevronDown className="h-10 w-10"/>
                  </Button>
                ) : (
                  <Button
                    className="cursor-pointer"
                    onClick={() => setOpenRow(openRow === campaign.id ? "" : campaign.id)}
                    variant="ghost"
                  >
                    <ChevronUp className="h-10 w-10"/>
                  </Button>
                )}
                </TableCell>
              </TableRow>

              {openRow === campaign.id && (
                <TableRow key={`${campaign.id}-details`}>
                  <TableCell colSpan={6}>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>
                            <Button
                              variant="ghost"
                              >
                                <CirclePlus/>
                            </Button>
                          </TableHead>
                          <TableHead></TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Submitted By</TableHead>
                          <TableHead>Submitted Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {campaign.creatives?.map((creative) => (
                        <ContextMenu key={creative.id}>
                          <ContextMenuTrigger asChild>
                            <TableRow>
                              <TableCell>
                                <Checkbox/>
                              </TableCell>
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
                            <ContextMenuItem onClick={() => onEditCrea(creative)}>Edit</ContextMenuItem>
                            <ContextMenuItem onClick={() => onDeleteCrea(creative)}>Delete</ContextMenuItem>
                            <ContextMenuItem onClick={() => onUnassignCrea(creative)}>Unassign</ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </Card>
  )

  {/*
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Campaign</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <Accordion 
              key={campaign.id}
              type="single"
              collapsible >
              <AccordionItem key={campaign.id} value={campaign.id}>
                  <ContextMenu key={campaign.id}>
                    <ContextMenuTrigger asChild>
                      <TableRow>
                        <TableCell>
                          <AccordionTrigger/>
                        </TableCell>
                        <TableCell> {campaign.name} </TableCell>
                        <TableCell className="text-muted-foreground">{campaign.submittedBy || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {campaign.submissionDate ? formatDisplayDate(campaign.submissionDate, "PP") : "-"}
                        </TableCell>
                        <TableCell>
                          <CampaignStatusBadge status={campaign.status} />
                        </TableCell>
                      </TableRow>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => onEditCamp(campaign)}>Edit</ContextMenuItem>
                      <ContextMenuItem onClick={() => onDeleteCamp(campaign)}>Delete</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                <AccordionContent>
                  <Button
                    variant="ghost"
                    >
                      <CirclePlus/>
                  </Button>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead></TableHead>
                        <TableHead>Preview</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Submitted By</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {campaign.creatives?.map((creative) => (
                      <ContextMenu key={creative.id}>
                        <ContextMenuTrigger asChild>
                          <TableRow>
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
                          <ContextMenuItem onClick={() => onEditCrea(creative)}>Edit</ContextMenuItem>
                          <ContextMenuItem onClick={() => onDeleteCrea(creative)}>Delete</ContextMenuItem>
                          <ContextMenuItem onClick={() => onUnassignCrea(creative)}>Unassign</ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
  */}
}


