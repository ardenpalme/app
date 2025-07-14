import { NextResponse } from "next/server"
import { downloadFileFromWorker } from "@/lib/r2-worker"

export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  try {
    const filename = params.slug.join("/")
    if (!filename) {
      return new NextResponse("Filename is required", { status: 400 })
    }

    const fileBlob = await downloadFileFromWorker(filename)

    // Get the content type from the blob
    const contentType = fileBlob.type

    // Create a streaming response
    const readableStream = fileBlob.stream()

    return new Response(readableStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileBlob.size.toString(),
        // Add cache control headers for better performance
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error fetching file from R2:", error)
    // Check if the error message indicates a "not found" scenario from the worker
    if (error instanceof Error && error.message.includes("Failed to download file")) {
      return new NextResponse("File not found in R2 bucket", { status: 404 })
    }
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

