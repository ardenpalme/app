"use client";

import cuid from "cuid"
import { useUser } from "@clerk/nextjs"
import dynamic from "next/dynamic";
import { deleteFileFromWorker, uploadFileToWorker } from "@/lib/r2-worker";
import { trpc } from "@/app/_trpc/client";
import { getMediaMetadata, getVideoThumbnail } from "@/utils/helpers";
import { creativeFormSchema } from "@/schemas/assets";

const LayoutEditor = dynamic(() => import("@/components/layout-editor/editor"), {
  ssr: false, // 🚨 CRITICAL
});


export default function LayoutEditorPage() {
  const { data: allAssets, isLoading: isLoadingAssets, refetch : refetchAssets } = trpc.creative.listAll.useQuery()
  const { mutateAsync: uploadCreative } = trpc.creative.add.useMutation()
  const { mutateAsync: deleteCreative } = trpc.creative.delete.useMutation()
  const { mutateAsync: uploadRSSResource } = trpc.rss.add.useMutation()
  const { data: allRSS } = trpc.rss.listAll.useQuery()

  const { user } = useUser()
  const organization = user?.organizationMemberships[0];

  const uploadAsset = async (file : File) => {
    const fileName = file.name;
    const metadata = await getMediaMetadata(file)
    if (file.type.startsWith("video/")) {
      //store a thumbnail -- TODO TEST VIDEO UPLOAD
      const thumbnail_name = `{file.name}_thumbnail`;
      const thumbnail_file = await getVideoThumbnail(file)
      await uploadFileToWorker(thumbnail_file, thumbnail_name, new AbortController().signal);
    }

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
      width: metadata.width,
      height: metadata.height,
      duration: metadata.duration,

      orgId: "",
      submittedBy: "",
      submissionDate: new Date(),
    }
    console.log(in_creative);
    await uploadCreative(in_creative);
  }

  const deleteAsset = async (assetId: string) => {
    const { data: asset } = trpc.creative.listById.useQuery(assetId)

    if(asset) {
      const url = asset.fileUrl
      await deleteFileFromWorker(url);
      if (asset.fileType.startsWith("video/")) {
        const thumbnailUrl = url.replace(/(\.[^/.]+)$/, '-thumbnail$1');
        await deleteFileFromWorker(thumbnailUrl);
      }
    }
    await deleteCreative({ id: assetId })
  }

  const uploadRSS = async (rssUrl: string) => {
    const in_rss = {
      id: cuid(),
      name: "",
      tags: [],
      url: rssUrl,
      orgId: "",
    }
    console.log(in_rss);
    await uploadRSSResource(in_rss);
  }

  return (
    <LayoutEditor
      creatives={allAssets ?? []}
      rssObjs={allRSS ?? []}
      onRefresh={async () => {await refetchAssets()}}
      uploadAsset={uploadAsset}
      deleteAsset={deleteAsset}
      uploadRSS={uploadRSS}
    />
  );
}

