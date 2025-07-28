"use client"

import dynamic from "next/dynamic";

const LayoutEditor = dynamic(() => import("@/components/layout-editor"), {
  ssr: false,
});

export default function LayoutEditorPage() {
  return (
    <div className="bg-[#F6F8FA] min-h-screen">
      <LayoutEditor />
    </div>
  );
}

