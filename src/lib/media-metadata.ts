"use client"

import { CreativeForm, CreativeObj, MediaMetadata, mediaMetadataSchema } from "@/schemas/assets"
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
