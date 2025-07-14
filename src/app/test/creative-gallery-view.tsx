"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreativeStatusBadge } from "@/components/status-badges"
import { creativeList, creativeObj } from "@/schemas/assets"

export function CreativeGalleryView({
  creatives,
  onViewDetails,
}: {
  creatives: creativeList
  onViewDetails: (creative: creativeObj ) => void
}) {
  if (creatives.length === 0) {
    return <div className="text-center text-muted-foreground py-24">No creatives found.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {creatives.map((creative) => (
        <Card key={creative.id} className="flex flex-col">
          <CardHeader>
            <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
              <img
                src={creative.fileUrl ? `/api/r2/${creative.fileUrl}` : "/placeholder.svg"}
                alt={creative.name}
                className="h-full w-full object-cover"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-2">
            <CardTitle className="text-base leading-tight">{creative.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{creative.campaign?.name || "Unassigned"}</p>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <CreativeStatusBadge status={creative.approvalStatus} />
            <Button variant="secondary" size="sm" onClick={() => onViewDetails(creative)}>
              Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

