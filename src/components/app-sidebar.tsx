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

const menu_groups = [
  {
    title: "Content Management System",
    data: [
      {
        title: "Campaigns",
        url: "/campaigns",
        icon: Folder
      },
      {
        title: "Creatives",
        url: "/creatives",
        icon: GalleryVerticalEnd
      },
      {
        title: "Design",
        url: "/layouts",
        icon: PenTool
      },
      {
        title: "Playlists",
        url: "/playlists",
        icon: Logs
      },
    ]
  },
  {
    title: "Signage Network Management",
    data: [
      {
        title: "Displays",
        url: "/",
        icon: TvMinimal
      },
    ]
  },

  {
    title: "Analytics Dashboards",
    data: [
      {
        title: "Audience Analytics",
        url: "/",
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
  return (
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher teams={org_and_user_data.org} />
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
        <NavUser user={org_and_user_data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
