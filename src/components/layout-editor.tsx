"use client"

import * as React from "react"
import { MediaSidebar } from "@/components/media-library-sidebar"
import { CanvasEditor } from "@/components/canvas-editor"
import type { CanvasItem } from "@/lib/types"
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function LayoutEditor() {
  const [items, setItems] = React.useState<CanvasItem[]>([])
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const stageRef = React.useRef<any>(null)
  const dragItemRef = React.useRef<any>(null)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (stageRef.current) {
      stageRef.current.setPointersPositions(e)
      const position = stageRef.current.getPointerPosition()
      const dragItemData = dragItemRef.current

      if (position && dragItemData) {
        const newItem: CanvasItem = {
          id: `item-${Date.now()}`,
          src: dragItemData.src,
          x: position.x - (dragItemData.width / 2 || 50),
          y: position.y - (dragItemData.height / 2 || 50),
          width: dragItemData.width || 100,
          height: dragItemData.height || 100,
          rotation: 0,
        }
        setItems((prevItems) => [...prevItems, newItem])
        setSelectedId(newItem.id)
      }
    }
    dragItemRef.current = null
  }

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>, src: string) => {
    dragItemRef.current = {
      src,
      width: e.currentTarget.width,
      height: e.currentTarget.height,
    }
  }

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      setSelectedId(null)
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon" className="border-r">
          <MediaSidebar onDragStart={handleDragStart} />
        </Sidebar>
        <SidebarInset className="flex-1 !m-0 !p-0 !rounded-none !shadow-none">
          <div className="flex-1 h-full w-full" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <CanvasEditor
              stageRef={stageRef}
              items={items}
              setItems={setItems}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onStageMouseDown={checkDeselect}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

