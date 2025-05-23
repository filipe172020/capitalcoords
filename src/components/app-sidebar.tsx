"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "ESPORTES",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Futebol",
          url: "#",
        },
        {
          title: "Basquete",
          url: "#",
        },
        {
          title: "Tênis",
          url: "#",
        },
        {
          title: "Futebol Americano",
          url: "#",
        },
        {
          title: "Beisebol",
          url: "#",
        },
        {
          title: "Boxe",
          url: "#",
        },
        {
          title: "MMA",
          url: "#",
        },
        {
          title: "eSports",
          url: "#",
        },
        {
          title: "Críquete",
          url: "#",
        },
      ],
    },
    {
      title: "DESTAQUE",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
