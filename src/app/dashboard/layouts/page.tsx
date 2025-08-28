"use client";

import { createId } from "@paralleldrive/cuid2";
import { useUser } from "@clerk/nextjs"
import dynamic from "next/dynamic";
import { deleteFileFromWorker, uploadFileToWorker } from "@/lib/r2-worker";
import { trpc } from "@/app/_trpc/client";
import { dataURLtoFile, getMediaMetadata, getVideoThumbnail } from "@/utils/helpers";
import { creativeFormSchema, CreativeObj, designObj, rssObj, rssObjRender } from "@/schemas/assets";
import { StoreType } from "polotno/model/store";
import { fileURLToPath } from "url";

const LayoutEditor = dynamic(() => import("@/components/layout-editor/editor"), {
  ssr: false, // 🚨 CRITICAL
});

export default function LayoutEditorPage() {
  const { mutateAsync: uploadCreative } = trpc.creative.add.useMutation()
  const { mutateAsync: deleteCreative } = trpc.creative.delete.useMutation()
  const { data: allAssets, isLoading: isLoadingAssets, refetch : refetchAssets } = trpc.creative.listAll.useQuery()

  const { mutateAsync: uploadRSSResource } = trpc.rss.add.useMutation()
  const { mutateAsync: deleteRSSResource } = trpc.rss.delte.useMutation()
  const { data: allRSS, refetch: refetchRSS } = trpc.rss.listAll.useQuery()

  const { mutateAsync: uploadDesign } = trpc.design.add.useMutation()
  const { mutateAsync: deleteDesign } = trpc.design.delete.useMutation()
  const { data : allDesigns, refetch: refetchDesigns } = trpc.design.listAll.useQuery()


  const { user } = useUser()
  const organization = user?.organizationMemberships[0];

  const saveDesign = async (store: StoreType) => {
    const design_json = store.toJSON();
    const design_blob = await store.toBlob(); 

    const id = createId();
    const thumbnail_filename = `${id}_design_thumbnail.png`
    const thumbnail_file = new File([design_blob], thumbnail_filename, { type: "image/png" });
    await uploadFileToWorker(thumbnail_file, thumbnail_filename, new AbortController().signal);

    const in_design : designObj = {
      id: createId(),
      name: thumbnail_filename,
      tags: [],
      design_obj: design_json,
      orgId: "",
    }
    console.log(in_design);
    await uploadDesign(in_design);
  }

  const removeDesign = async (design : designObj) => {
    if(design) {
      const url = design.name;
      console.log("deleting from Worker design:", url)
      await deleteFileFromWorker(url);
    }
    await deleteDesign({ id: design.id })
  }

  const uploadAsset = async (file : File) => {
    const fileName = file.name;
    const metadata = await getMediaMetadata(file)
    if (file.type.startsWith("video/")) {

      const in_file = file.name
      const thumbnail_name = in_file.replace(/(\.[^/.]+)$/, '_thumbnail.jpg');
      const thumbnail_file = await getVideoThumbnail(file)
      console.log(thumbnail_name);
      await uploadFileToWorker(thumbnail_file, thumbnail_name, new AbortController().signal);
    }

    await uploadFileToWorker(file, fileName, new AbortController().signal);

    const in_creative = {
      id: createId(),
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

  const deleteAsset = async (asset : CreativeObj) => {
    if(asset) {
      const url = asset.fileUrl
      await deleteFileFromWorker(url);
      if (asset.fileType.startsWith("video/")) {
        const thumbnailUrl = url.replace(/(\.[^/.]+)$/, '_thumbnail.jpg');
        await deleteFileFromWorker(thumbnailUrl);
      }
    }
    await deleteCreative({ id: asset.id })
  }

  const uploadRSS = async (rssUrl: string) => {
    const in_rss = {
      id: createId(),
      name: "",
      tags: [],
      url: rssUrl,
      orgId: "",
    }
    console.log(in_rss);
    await uploadRSSResource(in_rss);
  }

  const deleteRSS = async (rssItem: rssObjRender) => {
    await deleteRSSResource({id: rssItem?.id ?? ""})
  }

  // TODO refresh should only refresh the required data
  const refetchAll = async () => {
    await refetchAssets();
    await refetchDesigns();
    await refetchRSS();
  }

  return (
    <LayoutEditor
      creatives={allAssets ?? []}
      rssObjs={allRSS ?? []}
      designs={allDesigns ?? []}
      onRefresh={refetchAll}
      uploadAsset={uploadAsset}
      deleteAsset={deleteAsset}
      uploadRSS={uploadRSS}
      deleteRSS={deleteRSS}
      uploadDesign={saveDesign}
      deleteDesign={removeDesign}
    />
  );
}

