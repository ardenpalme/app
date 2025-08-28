"use client" 

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { AudioWaveform, ChartPie, Folder, Frame, GalleryVerticalEnd, Logs, PenTool, TvMinimal} from "lucide-react"
import Link from "next/link"
import { NavUser } from "./sidebar/nav-user"
import { TeamSwitcher } from "./sidebar/team-switcher"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs";

const menu_groups = [
  {
    title: "Content Management System",
    data: [
      {
        title: "Campaigns",
        url: "/dashboard/campaigns",
        icon: Folder
      },
      {
        title: "Creatives",
        url: "/dashboard/creatives",
        icon: GalleryVerticalEnd
      },
      {
        title: "Design",
        url: "/dashboard/layouts",
        icon: PenTool
      },
      {
        title: "Playlists",
        url: "/dashboard/playlists",
        icon: Logs
      },
    ]
  },
  {
    title: "Signage Network Management",
    data: [
      {
        title: "Displays",
        url: "/dashboard",
        icon: TvMinimal
      },
    ]
  },

  {
    title: "Analytics Dashboards",
    data: [
      {
        title: "Audience Analytics",
        url: "/dashboard",
        icon: ChartPie
      },
    ]
  }
]

const org_and_user_data= {
  org: [
    {
      name: "Acme Inc",
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      plan: "Startup",
    }
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

export function AppSidebar() {
  const { isLoaded, user } = useUser();
  const orgs = user?.organizationMemberships

  if (!isLoaded) return null;
  console.log(user, orgs);

  return (
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher orgs={orgs} />
      </SidebarHeader>
      <SidebarContent>
        {menu_groups.map((group) => (
          <SidebarGroup key={group.title}>
           <SidebarGroupLabel>{group.title}</SidebarGroupLabel> 
           <SidebarGroupContent>
            <SidebarMenu>
              {group.data.map((item) => (
                <SidebarMenuItem key={item.title}> 
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
           </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
