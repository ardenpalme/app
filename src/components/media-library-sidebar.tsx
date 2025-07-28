"use client"

import type React from "react"

import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"

const mediaItems = [
  { id: "1", src: "/api/r2/cmd4ms800000e2a6orxbc9op9.jpg"},
  { id: "2", src: "/api/r2/cmd4ms800000e2a6orxbc9op9.jpg"},
  { id: "3", src: "/api/r2/cmd4ms800000e2a6orxbc9op9.jpg"},
]

interface MediaSidebarProps {
  onDragStart: (e: React.DragEvent<HTMLImageElement>, src: string) => void
}

export function MediaSidebar({ onDragStart }: MediaSidebarProps) {
  return (
    <SidebarContent className="p-0">
      <ScrollArea className="h-full">
        <SidebarGroup className="p-2">
          <SidebarGroupLabel>Media Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  className="aspect-square bg-muted rounded-md overflow-hidden group-data-[collapsible=icon]:hidden"
                >
                  <img
                    src={item.src || "/placeholder.svg"}
                    alt={`Media item ${item.id}`}
                    draggable="true"
                    onDragStart={(e) => onDragStart(e, item.src)}
                    className="w-full h-full object-cover cursor-grab"
                    crossOrigin="anonymous"
                  />
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </ScrollArea>
    </SidebarContent>
  )
}

