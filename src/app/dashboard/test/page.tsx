"use client"

import { trpc } from "@/app/_trpc/client"
import Image from "next/image";

export default function TestPage() {
  const { data: allCreatives = [], isLoading: isLoadingCreatives, refetch } = trpc.creative.listAll.useQuery()
  if(isLoadingCreatives) return (<p>loading...</p>);
  return (
    <div className="mx-auto">
      {allCreatives.map((creative) => (
        <Image
          key={creative.id}
          src={`/api/r2/${creative.fileUrl}`}
          alt="creative img"
          width={20}
          height={20}
          />
      ))}
    </div>
  );
}

