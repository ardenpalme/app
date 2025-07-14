"use client"

import cuid from "cuid"
import { useState, useRef, useMemo, useEffect } from "react"
import { useUser, useOrganization } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Loader2, UploadCloud, X, CheckCircle, AlertCircle, FileVideo, CirclePlus } from "lucide-react"
import { cn, formatBytes } from "@/lib/utils"
import { uploadFileToWorker } from "@/lib/r2-worker"
import { trpc } from "@/app/_trpc/client"
import { CreativeForm, CreativeObj, MediaMetadata, mediaMetadataSchema } from "@/schemas/assets"


type UploadingFile = {
  tempId: string
  file: File
  previewUrl: string
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
  metadata?: MediaMetadata
}

export const getMediaMetadata = async (file: File): Promise<MediaMetadata> => {
  if (file.type.startsWith("image/")) {
    const img = new Image()
    const src = URL.createObjectURL(file)
    img.src = src

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error("Could not read image metadata."))
    })

    URL.revokeObjectURL(src)

    return mediaMetadataSchema.parse({
      width: img.width,
      height: img.height,
      duration: 0, // images have no duration
    })
  }

  if (file.type.startsWith("video/")) {
    const video = document.createElement("video")
    const src = URL.createObjectURL(file)
    video.src = src
    video.preload = "metadata"

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve()
      video.onerror = () => reject(new Error("Could not read video metadata."))
    })

    URL.revokeObjectURL(src)

    return mediaMetadataSchema.parse({
      width: video.videoWidth,
      height: video.videoHeight,
      duration: video.duration,
    })
  }


  // Fallback for other file types
  return mediaMetadataSchema.parse({
    width: 0,
    height: 0,
    duration: 0,
  })
}

const UploadNewAsset = ({ onUploadSuccess }: { onUploadSuccess: (creative: CreativeObj) => void }) => {
  const { user } = useUser()
  const organization = user?.organizationMemberships[0];

  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: uploadCreative } = trpc.creative.add.useMutation()

  const handleFiles = async (files: FileList | File[]) => {
    const newFiles: UploadingFile[] = []

    for (const file of Array.from(files)) {
      try {
        const metadata = await getMediaMetadata(file)
        newFiles.push({
          tempId: cuid(),
          file,
          previewUrl: URL.createObjectURL(file),
          progress: 0,
          status: "pending",
          metadata,
        })
      } catch (error) {
        newFiles.push({
          tempId: cuid(),
          file,
          previewUrl: "",
          progress: 0,
          status: "error",
          error: "Could not read file metadata",
        })
      }
    }

    setUploadingFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (tempId: string) => {
    setUploadingFiles((prev) => {
      const fileToRemove = prev.find((f) => f.tempId === tempId)
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl)
      }
      return prev.filter((f) => f.tempId !== tempId)
    })
  }

  useEffect(() => {
    return () => {
      uploadingFiles.forEach((f) => {
        if (f.previewUrl) {
          URL.revokeObjectURL(f.previewUrl)
        }
      })
    }
  }, [uploadingFiles])

  const uploadAllFiles = async () => {
    if (!user || !organization) return

    setIsUploading(true)
    const pendingFiles = uploadingFiles.filter((f) => f.status === "pending")

    for (const fileToUpload of pendingFiles) {
      try {
        setUploadingFiles((prev) =>
          prev.map((f) => (f.tempId === fileToUpload.tempId ? { ...f, status: "uploading" } : f)),
        )

        const file = fileToUpload.file
        const fileExtension = file.name.split(".").pop()
        const fileName = `${cuid()}.${fileExtension}`

        await uploadFileToWorker(file, fileName, new AbortController().signal);

        const in_creative = {
          id: cuid(),
          name: file.name.replace(/\.[^/.]+$/, ""),
          notes: "",
          tags: [],
          proofOfPlay: false,

          fileUrl: fileName,
          fileType: file.type || "application/octet-stream",
          fileSize: file.size,
          width: fileToUpload.metadata?.width,
          height: fileToUpload.metadata?.height,
          duration: fileToUpload.metadata?.duration,

          orgId: organization.id,
          submittedBy: user.id,
          submissionDate: new Date(),
        }
        console.log(in_creative);

        const newCreative = await uploadCreative(in_creative);

        setUploadingFiles((prev) =>
          prev.map((f) => (f.tempId === fileToUpload.tempId ? { ...f, status: "success" } : f)),
        )

        onUploadSuccess(newCreative);
      } catch (error) {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.tempId === fileToUpload.tempId
              ? { ...f, status: "error", error: error instanceof Error ? error.message : "Upload failed" }
              : f,
          ),
        )
      }
    }

    setIsUploading(false)
  }

  const clearCompleted = () => {
    setUploadingFiles((prev) => prev.filter((f) => f.status !== "success"))
  }

  const hasFiles = uploadingFiles.length > 0
  const hasPendingFiles = uploadingFiles.some((f) => f.status === "pending")
  const hasSuccessFiles = uploadingFiles.some((f) => f.status === "success")

  return (
    <div className="p-1 flex flex-col h-full">

      <div className="mt-4 flex flex-col flex-1 min-h-0">
        {hasFiles ? (
          <div className="flex flex-col flex-1 min-h-0 space-y-2">
            <div className="flex items-center justify-between px-1">
              <h4 className="font-medium text-sm">Upload Queue ({uploadingFiles.length})</h4>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".mp4,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CirclePlus />
                </Button>
              </div>
              {hasSuccessFiles && (
                <Button variant="ghost" size="sm" onClick={clearCompleted}>
                  Clear Completed
                </Button>
              )}
            </div>

            <ScrollArea className="flex-1 border rounded-md max-h-80 overflow-auto">
              <div className="p-2 space-y-2">
                {uploadingFiles.map((f) => (
                  <div key={f.tempId} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                    <div className="w-16 h-10 bg-muted rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {f.file.type.startsWith("image/") && f.previewUrl ? (
                        <img
                          src={f.previewUrl || "/placeholder.svg"}
                          alt={f.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileVideo className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{f.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {f.file.type} - {formatBytes(f.file.size)}
                      </p>
                      {f.status === "uploading" && <Progress value={f.progress} className="mt-1 h-1" />}
                      {f.status === "error" && <p className="text-xs text-red-500 mt-1">{f.error}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      {f.status === "pending" && (
                        <Button variant="ghost" size="sm" onClick={() => removeFile(f.tempId)} className="h-6 w-6 p-0">
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      {f.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                      {f.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {f.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {hasPendingFiles && (
              <div className="pt-2">
                <Button onClick={uploadAllFiles} disabled={isUploading} className="w-full">
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    `Upload ${uploadingFiles.filter((f) => f.status === "pending").length} File(s)`
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-6 text-center transition-colors",
              isDragging && "border-primary bg-primary/10",
            )}
            onDragEnter={(e) => (e.preventDefault(), e.stopPropagation(), setIsDragging(true))}
            onDragLeave={(e) => (e.preventDefault(), e.stopPropagation(), setIsDragging(false))}
            onDragOver={(e) => (e.preventDefault(), e.stopPropagation())}
            onDrop={(e) => (
              e.preventDefault(), e.stopPropagation(), setIsDragging(false), handleFiles(e.dataTransfer.files)
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".mp4,.jpg,.jpeg,.png"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-2 text-base font-semibold">Drag and drop files here</h3>
            <p className="mt-1 text-xs text-muted-foreground">or</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 bg-transparent"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

const SelectFromLibrary = ({ onSelect }: { onSelect: (creatives: CreativeObj[]) => void }) => {
  const { data: unassigned, isLoading } = trpc.creative.listUnassigned.useQuery()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCreatives = useMemo(() => {
    if (!Array.isArray(unassigned)) return []
    return unassigned.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [unassigned, searchTerm])

  const handleSelect = (creativeId: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(creativeId)) {
      newSet.delete(creativeId)
    } else {
      newSet.add(creativeId)
    }
    setSelectedIds(newSet)
  }

  const handleAddSelected = () => {
    if (!Array.isArray(unassigned)) return
    const selectedCreatives = unassigned.filter((c) => selectedIds.has(c.id))
    onSelect(selectedCreatives)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[50vh]">
      <Input
        placeholder="Search library..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="flex-1 border rounded-md">
        <div className="p-4 space-y-2">
          {filteredCreatives.length > 0 ? (
            filteredCreatives.map((creative) => (
              <div
                key={creative.id}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => handleSelect(creative.id)}
              >
                <Checkbox checked={selectedIds.has(creative.id)} onCheckedChange={() => handleSelect(creative.id)} />
                <div className="w-16 h-9 bg-muted rounded overflow-hidden flex-shrink-0">
                  <img src={`/api/r2/${creative.fileUrl}`} alt={creative.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{creative.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {creative.fileType} - {formatBytes(creative.fileSize)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No unassigned creatives found.</p>
          )}
        </div>
      </ScrollArea>
      <Button onClick={handleAddSelected} disabled={selectedIds.size === 0} className="mt-4">
        Add {selectedIds.size} Selected Asset(s)
      </Button>
    </div>
  )
}

interface AddAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssetSelect?: (creatives: CreativeObj[]) => void
  onUploadSuccess?: (creative: CreativeObj) => void
  mode?: "default" | "uploadOnly"
}

export function AddAssetDialog({
  open,
  onOpenChange,
  onAssetSelect,
  onUploadSuccess,
  mode = "default",
}: AddAssetDialogProps) {
  const handleSelect = (creatives: CreativeObj[]) => {
    if (onAssetSelect) {
      onAssetSelect(creatives)
    }
    onOpenChange(false)
  }

  const handleUpload = (creative: CreativeObj) => {
    if (onAssetSelect) {
      onAssetSelect([creative])
    }
    if (onUploadSuccess) {
      onUploadSuccess(creative)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Creative Asset</DialogTitle>
        </DialogHeader>
        {mode === "default" ? (
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select">Select from Library</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
            </TabsList>
            <TabsContent value="select">
              <SelectFromLibrary onSelect={handleSelect} />
            </TabsContent>
            <TabsContent value="upload">
              <UploadNewAsset onUploadSuccess={handleUpload} />
            </TabsContent>
          </Tabs>
        ) : (
          <UploadNewAsset onUploadSuccess={handleUpload} />
        )}
      </DialogContent>
    </Dialog>
  )
}

