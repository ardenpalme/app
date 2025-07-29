const R2_WORKER_URL = "https://r2-worker.ardenpalme.workers.dev/api/files"
const R2_PSK = "e3a1c6b4d9f27a815b3cf1d6982ab6ed973420e8795a6f8cda2f5f4135c4a0ee"

/**
 * Uploads a file to the Cloudflare R2 worker.
 * @param file The file to upload.
 * @param fname The unique filename to use for storage.
 * @param signal An AbortSignal to allow for cancellation.
 */
export const uploadFileToWorker = async (file: File, fname: string, signal: AbortSignal) => {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${R2_WORKER_URL}/${fname}`, {
    method: "PUT",
    headers: {
      "x-custom-psk": R2_PSK,
    },
    body: form,
    signal,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload failed: ${res.status} - ${text}`)
    // TODO failsafe return?
  }
  const json = await res.json();
  return json; 
}

/**
 * Downloads a file from the Cloudflare R2 worker.
 * @param fname The unique filename (stored as fileUrl in the database).
 * @returns A Promise that resolves to the file Blob.
 */
export const downloadFileFromWorker = async (fname: string): Promise<Blob> => {
  console.log(">>", fname)
  const res = await fetch(`${R2_WORKER_URL}/${fname}`, {
    headers: {
      "x-custom-psk": R2_PSK,
    },
  })
  if (!res.ok) {
    throw new Error("Failed to download file.")
  }
  console.log(">>", fname)
  return res.blob()
}

/**
 * Deletes a file from the Cloudflare R2 worker.
 * @param fname The unique filename (stored as fileUrl in the database).
 * @returns A Promise that resolves when the deletion is complete.
 */
export const deleteFileFromWorker = async (fname: string): Promise<void> => {
  const res = await fetch(`${R2_WORKER_URL}/${fname}`, {
    method: "DELETE",
    headers: {
      "x-custom-psk": R2_PSK,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Delete failed: ${res.status} - ${text}`)
  }
}
