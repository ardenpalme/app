"use client" 

import { trpc } from "@/app/_trpc/client";
import Calendar from "@/components/calendar";
import { EventsProvider } from "@/context/events-context";
import { useUser } from "@clerk/nextjs"
import dynamic from "next/dynamic";


export default function Scheduler() {
  const { data: allAssets, isLoading: isLoadingAssets } = trpc.creative.listAll.useQuery()
  const { data : allDesigns, isLoading: isLoadingDesigns } = trpc.design.listAll.useQuery()
  const { data : allPlaylists, isLoading: isLoadingPlaylists } = trpc.playlist.listAll.useQuery()

  const { user } = useUser()
  const organization = user?.organizationMemberships[0];

  if (
    isLoadingDesigns || isLoadingAssets || isLoadingPlaylists ||
    !allAssets || !allDesigns || !allPlaylists
  ) {
    return <p>Loading...</p>;
  }

  return (
    <EventsProvider>
      <div className="px-4">
        <Calendar 
          orgId={organization?.id ?? ""}
          creatives={allAssets}
          designs={allDesigns}
          playlists={allPlaylists}
          />
      </div>
    </EventsProvider>
  );
}
