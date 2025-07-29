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

export const getVideoThumbnail = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      try {
        video.currentTime = 0.5;
      } catch {
        resolve(new File([], 'thumbnail.jpg'));
      }
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Could not get canvas context'));

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Failed to generate blob from canvas'));
        const thumbFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
        resolve(thumbFile);
        URL.revokeObjectURL(video.src);
      }, 'image/jpeg');
    };

    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };
  });
};

