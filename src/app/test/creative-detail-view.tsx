"use client"

import type React from "react"
import { CreativeObj, CreativeList } from "@/schemas/assets"
import { Badge } from "@/components/ui/badge"
import { CreativeStatusBadge } from "@/components/status-badges"
import { FileVideo } from "lucide-react"
import { formatBytes, formatDuration, gcd, formatDisplayDate } from "@/lib/utils"

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-base">{value}</p>
  </div>
)

export function CreativeDetailView({ creative }: { creative: CreativeObj }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
          {creative.fileUrl ? (
            <img src={`/api/r2/${creative.fileUrl}`} alt={creative.name} className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FileVideo className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold">Notes</h3>
          <p className="text-sm text-muted-foreground">{creative.notes || "No notes provided."}</p>
        </div>
      </div>
      <div className="space-y-4">
        <DetailItem label="Campaign" value={creative.campaign?.name || "Unassigned"} />
        <DetailItem label="Status" value={<CreativeStatusBadge status={creative.approvalStatus} />} />
        <div className="grid grid-cols-2 gap-4">
          <DetailItem label="Submitted By" value={creative.submittedBy || "-"} />
          <DetailItem
            label="Submitted Date"
            value={creative.submissionDate ? formatDisplayDate(creative.submissionDate, "PPP") : "-"}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {creative.width && creative.height && (
            <>
              <DetailItem label="Resolution" value={`${creative.width} x ${creative.height}`} />
              <DetailItem
                label="Aspect Ratio"
                value={`${creative.width / gcd(creative.width, creative.height)}:${
                  creative.height / gcd(creative.width, creative.height)
                }`}
              />
            </>
          )}
          {creative.duration && <DetailItem label="Duration" value={formatDuration(creative.duration)} />}
          <DetailItem label="File Size" value={formatBytes(creative.fileSize)} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Tags</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {creative.tags.length > 0 ? (
              creative.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No tags.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

