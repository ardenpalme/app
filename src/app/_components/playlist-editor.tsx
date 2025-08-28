"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import type { DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  GripVertical,
  Plus,
  Trash2,
  Video,
  ImageIcon,
  Clock,
  Search,
  Settings,
  Bell,
  Monitor,
  RatioIcon as AspectRatio,
} from "lucide-react"
import Image from "next/image"
import { trpc } from "@/app/_trpc/client"
import { calculateAspectRatio } from "@/utils/helpers"
import { PlaylistItem } from "@/lib/type"
import { createId } from "@paralleldrive/cuid2"
import { CreativeList, editPlaylistForm, playlistObj, playlistSchema } from "@/schemas/assets"
import { ControllerRenderProps } from "react-hook-form"

export function PlaylistEditor({
  form_fields,
  assets,
  assetOrder,
  setAssetIdOrder
} : {
  form_fields: ControllerRenderProps<editPlaylistForm, "assets">
  assets: CreativeList
  assetOrder: string[]
  setAssetIdOrder : React.Dispatch<React.SetStateAction<string[]>>
}) {
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([])
  const [playlistName, setPlaylistName] = useState("Morning Loop")
  const [playlistDescription, setPlaylistDescription] = useState("Playlist for all lobby screens")
  const [isNewPlaylistDialogOpen, setIsNewPlaylistDialogOpen] = useState(false)
  const [playlistAspectRatio, setPlaylistAspectRatio] = useState("16:9")

  const commitToForm = (items: PlaylistItem[]) => {
    setPlaylistItems(items);
    setAssetIdOrder(items.map(item => item.asset?.id));

    // write only the creatives to the form field
    form_fields.onChange(items.map((i) => i.asset));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) {
      return
    }

    if (source.droppableId === "media-library" && destination.droppableId === "playlist-timeline") {
      const asset = assets?.[source.index]
      const aspectRatio = calculateAspectRatio(asset?.width ?? 0, asset?.height ?? 0)
      const newItem : PlaylistItem = {
        id: createId(),
        aspectRatio,
        asset
      }
      const newPlaylistItems = Array.from(playlistItems)
      newPlaylistItems.splice(destination.index, 0, newItem)
      commitToForm(newPlaylistItems)

    } else if (source.droppableId === "playlist-timeline" && destination.droppableId === "playlist-timeline") {
      const items = Array.from(playlistItems)
      const [reorderedItem] = items.splice(source.index, 1)
      items.splice(destination.index, 0, reorderedItem)
      commitToForm(items)
    }
  }

  const removePlaylistItem = (id: string) => {
    setPlaylistItems(playlistItems.filter((item) => item.id !== id))
  }

  const handleDurationChange = (id: string, newDuration: number) => {
    setPlaylistItems(
      playlistItems.map((item) =>
        item.id === id ? { ...item, duration: (isNaN(newDuration) || newDuration < 1) ? 1 : newDuration } : item,
      ),
    )
  }

  const totalDuration = useMemo(() => playlistItems.reduce((acc, i) => acc + (i.asset.duration ?? 0), 0), [playlistItems]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  {/* on mount, load the assets in the saved order*/}
  useEffect(() => {
    const items : PlaylistItem[] = assets.map((asset) => {
      const aspectRatio = calculateAspectRatio(asset?.width ?? 0, asset?.height ?? 0)
      const item : PlaylistItem = {
        id: createId(),
        aspectRatio,
        asset
      }
      return item
    })
    setPlaylistItems(items)

    if(assetOrder) {
      setPlaylistItems(prev => {
        // if prev is [{ asset: { id: string, ... }, ... }]
        const byId = new Map(prev.map(it => [it.asset.id, it]));
        return assetOrder.map(id => byId.get(id)!);
      });
    }
  },[])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-row p-2 gap-4 max-w-250 max-h-200">
        {/* Draggable Media Library */}
        <Card className="w-90 flex-initial border-r ">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Media Library</CardTitle>
          </CardHeader>
          <CardContent >
            <Droppable droppableId="media-library" isDropDisabled={true}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {assets?.map((asset, index) => (
                    <Draggable key={asset.id} draggableId={asset.id} index={index}>
                      {(provided, snapshot) => (
                        <>
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-2 cursor-grab rounded-lg flex items-center gap-3 transition-shadow ${snapshot.isDragging ? "shadow-lg bg-gray-50" : "bg-white"}`}
                          >
                            <div className="relative w-20 h-12">
                              <Image
                                src={`/api/r2/${asset.fileUrl}` || "/placeholder.svg"}
                                alt={asset.name}
                                fill
                                sizes="80px"
                                className="rounded-md object-cover"
                              />
                              <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                {formatDuration(asset.duration)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm text-gray-800 truncate">{asset.name}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                {asset.fileType.startsWith("video") ? (
                                  <Video className="w-3 h-3" />
                                ) : (
                                  <ImageIcon className="w-3 h-3" />
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                <div className="flex items-center gap-1">
                                  <AspectRatio className="w-3 h-3" />
                                  <span>{calculateAspectRatio(asset.width ?? 0, asset.height ?? 0)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {snapshot.isDragging && (
                            <div className="p-2 rounded-lg flex items-center gap-3 bg-gray-100 !shadow-none">
                              <div className="relative w-20 h-12">
                                <Image
                                  src={`/api/r2/${asset.fileUrl}` || "/placeholder.svg"}
                                  alt={asset.name}
                                  fill
                                  sizes="80px"
                                  className="rounded-md object-cover"
                                />
                                <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                  {formatDuration(asset.duration)}
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm text-gray-800 truncate">{asset.name}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  {asset.fileType.startsWith("video") ? (
                                    <Video className="w-3 h-3" />
                                  ) : (
                                    <ImageIcon className="w-3 h-3" />
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>
        {/* Playlist Timeline */}
        <Card className="flex-initial w-200 border-r">
          <CardContent>
            <div className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>
                    Total Duration: <span className="font-semibold">{formatDuration(totalDuration)}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AspectRatio className="w-4 h-4 text-gray-500" />
                  <span>{playlistAspectRatio}</span>
                </div>
              </div>
            </div>
            <Droppable droppableId="playlist-timeline">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`min-h-[300px] p-2 rounded-lg transition-colors ${snapshot.isDraggingOver ? "bg-blue-50" : "bg-white"}`}
                >
                  {playlistItems.length === 0 && !snapshot.isDraggingOver && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 border-2 border-dashed rounded-lg p-8">
                      <p className="font-semibold">Drag & Drop Media</p>
                      <p className="text-sm">Add creatives from the library to build your playlist.</p>
                    </div>
                  )}
                  {playlistItems.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`mb-2 p-3 rounded-lg flex items-center gap-4 transition-shadow bg-white border ${snapshot.isDragging ? "shadow-xl" : "shadow-sm"}`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab text-gray-400 hover:text-gray-600"
                          >
                            <GripVertical />
                          </div>
                          <div className="relative w-24 h-14">
                            <Image
                              src={`/api/r2/${item.asset.fileUrl}` || "/placeholder.svg"}
                              alt={`image for ${item.asset.name}`}
                              fill
                              sizes="96px"
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.asset.name}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center gap-2">
                                {item.asset.fileType.startsWith("video") ? (
                                  <Video className="w-4 h-4" />
                                ) : (
                                  <ImageIcon className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <AspectRatio className="w-3 h-3" />
                                <span>{item.aspectRatio}</span>
                              </div>
                            </div>
                          </div>
                          <div className="w-32 text-right">
                            {item.asset.fileType.startsWith("video") ? (
                              <div className="flex items-center gap-2 justify-end">
                                <Input
                                  type="number"
                                  value={item.asset.duration}
                                  onChange={(e) =>
                                    handleDurationChange(item.id, Number.parseInt(e.target.value, 10))
                                  }
                                  className="w-16 text-right"
                                  min="1"
                                />
                                <span className="text-sm text-gray-600">sec</span>
                              </div>
                            ) : (
                              <span className="text-sm font-medium text-gray-700">
                                {formatDuration(item.asset.duration ?? 0)}
                              </span>
                            )}
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => removePlaylistItem(item.id)}>
                                  <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Remove</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>
      </div>
    </DragDropContext>
  )
}

