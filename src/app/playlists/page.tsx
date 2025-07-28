"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import type { DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

const initialMediaAssets = [
  {
    id: "media-1",
    type: "video",
    name: "Summer Sale Ad",
    duration: 15,
    thumbnail: "/placeholder.svg?height=100&width=160",
    resolution: "1920x1080",
    aspectRatio: "16:9",
  },
  {
    id: "media-2",
    type: "image",
    name: "New Collection",
    duration: 10,
    thumbnail: "/placeholder.svg?height=100&width=160",
    resolution: "1080x1920",
    aspectRatio: "9:16",
  },
  {
    id: "media-3",
    type: "video",
    name: "Brand Intro",
    duration: 30,
    thumbnail: "/placeholder.svg?height=100&width=160",
    resolution: "1920x1080",
    aspectRatio: "16:9",
  },
  {
    id: "media-4",
    type: "image",
    name: "Holiday Special",
    duration: 10,
    thumbnail: "/placeholder.svg?height=100&width=160",
    resolution: "1920x1080",
    aspectRatio: "16:9",
  },
  {
    id: "media-5",
    type: "image",
    name: "Logo Display",
    duration: 5,
    thumbnail: "/placeholder.svg?height=100&width=160",
    resolution: "800x800",
    aspectRatio: "1:1",
  },
]

const initialPlaylistItems = [
  {
    id: "item-1",
    mediaId: "media-1",
    type: "video",
    name: "Summer Sale Ad",
    duration: 15,
    thumbnail: "/placeholder.svg?height=100&width=160",
    resolution: "1920x1080",
    aspectRatio: "16:9",
  },
  {
    id: "item-2",
    mediaId: "media-2",
    type: "image",
    name: "New Collection",
    duration: 10,
    thumbnail: "/placeholder.svg?height=100&width=160",
    resolution: "1080x1920",
    aspectRatio: "9:16",
  },
]

export default function PlaylistBuilder() {
  const [mediaAssets, setMediaAssets] = useState(initialMediaAssets)
  const [playlistItems, setPlaylistItems] = useState(initialPlaylistItems)
  const [playlistName, setPlaylistName] = useState("Morning Loop")
  const [playlistDescription, setPlaylistDescription] = useState("Playlist for all lobby screens")
  const [isNewPlaylistDialogOpen, setIsNewPlaylistDialogOpen] = useState(false)
  const [playlistResolution, setPlaylistResolution] = useState("1920x1080")
  const [playlistAspectRatio, setPlaylistAspectRatio] = useState("16:9")

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) {
      return
    }

    if (source.droppableId === "media-library" && destination.droppableId === "playlist-timeline") {
      const asset = mediaAssets[source.index]
      const newItem = {
        id: `item-${Date.now()}`,
        mediaId: asset.id,
        ...asset,
      }
      const newPlaylistItems = Array.from(playlistItems)
      newPlaylistItems.splice(destination.index, 0, newItem)
      setPlaylistItems(newPlaylistItems)
    } else if (source.droppableId === "playlist-timeline" && destination.droppableId === "playlist-timeline") {
      const items = Array.from(playlistItems)
      const [reorderedItem] = items.splice(source.index, 1)
      items.splice(destination.index, 0, reorderedItem)
      setPlaylistItems(items)
    }
  }

  const removePlaylistItem = (id: string) => {
    setPlaylistItems(playlistItems.filter((item) => item.id !== id))
  }

  const handleDurationChange = (id: string, newDuration: number) => {
    setPlaylistItems(
      playlistItems.map((item) =>
        item.id === id ? { ...item, duration: isNaN(newDuration) || newDuration < 1 ? 1 : newDuration } : item,
      ),
    )
  }

  const handleCreatePlaylist = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const resolution = formData.get("resolution") as string
    const aspectRatio = resolution === "1920x1080" ? "16:9" : "9:16"

    setPlaylistName(name)
    setPlaylistDescription(description)
    setPlaylistResolution(resolution)
    setPlaylistAspectRatio(aspectRatio)
    setPlaylistItems([])
    setIsNewPlaylistDialogOpen(false)
  }

  const totalDuration = useMemo(() => playlistItems.reduce((acc, item) => acc + item.duration, 0), [playlistItems])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-screen font-sans bg-gray-50">
        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 bg-white border-r overflow-y-auto">
            <Card className="border-0 rounded-none">
              <CardHeader className="p-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Media Library</CardTitle>
                <Dialog open={isNewPlaylistDialogOpen} onOpenChange={setIsNewPlaylistDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Playlist
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Playlist</DialogTitle>
                      <DialogDescription>
                        Give your new playlist a name and description. You can add creatives after it's created.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreatePlaylist}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            defaultValue="New Awesome Playlist"
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe your playlist"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="resolution" className="text-right">
                            Resolution
                          </Label>
                          <Select name="resolution" defaultValue="1920x1080">
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select a resolution" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1920x1080">1920x1080 (16:9 Landscape)</SelectItem>
                              <SelectItem value="1080x1920">1080x1920 (9:16 Portrait)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Create Playlist</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-2">
                <Droppable droppableId="media-library" isDropDisabled={true}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {mediaAssets.map((asset, index) => (
                        <Draggable key={asset.id} draggableId={asset.id} index={index}>
                          {(provided, snapshot) => (
                            <>
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-2 rounded-lg flex items-center gap-3 transition-shadow ${snapshot.isDragging ? "shadow-lg bg-gray-50" : "bg-white"}`}
                              >
                                <div className="relative w-20 h-12">
                                  <Image
                                    src={asset.thumbnail || "/placeholder.svg"}
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
                                    {asset.type === "video" ? (
                                      <Video className="w-3 h-3" />
                                    ) : (
                                      <ImageIcon className="w-3 h-3" />
                                    )}
                                    <span>{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Monitor className="w-3 h-3" />
                                      <span>{asset.resolution}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <AspectRatio className="w-3 h-3" />
                                      <span>{asset.aspectRatio}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {snapshot.isDragging && (
                                <div className="p-2 rounded-lg flex items-center gap-3 bg-gray-100 !shadow-none">
                                  <div className="relative w-20 h-12">
                                    <Image
                                      src={asset.thumbnail || "/placeholder.svg"}
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
                                      {asset.type === "video" ? (
                                        <Video className="w-3 h-3" />
                                      ) : (
                                        <ImageIcon className="w-3 h-3" />
                                      )}
                                      <span>{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</span>
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
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{playlistName}</CardTitle>
                    <p className="text-gray-500">{playlistDescription}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">Save Draft</Button>
                    <Button>Publish</Button>
                  </div>
                </CardHeader>
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
                        <Monitor className="w-4 h-4 text-gray-500" />
                        <span>{playlistResolution}</span>
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
                                    src={item.thumbnail || "/placeholder.svg"}
                                    alt={item.name}
                                    fill
                                    sizes="96px"
                                    className="rounded-md object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">{item.name}</p>
                                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                    <div className="flex items-center gap-2">
                                      {item.type === "video" ? (
                                        <Video className="w-4 h-4" />
                                      ) : (
                                        <ImageIcon className="w-4 h-4" />
                                      )}
                                      <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Monitor className="w-3 h-3" />
                                      <span>{item.resolution}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <AspectRatio className="w-3 h-3" />
                                      <span>{item.aspectRatio}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="w-32 text-right">
                                  {item.type !== "video" ? (
                                    <div className="flex items-center gap-2 justify-end">
                                      <Input
                                        type="number"
                                        value={item.duration}
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
                                      {formatDuration(item.duration)}
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
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}

