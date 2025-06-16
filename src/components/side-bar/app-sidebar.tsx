"use client"

import {
  Box,
  Calculator,
  TextCursorInput,
  User2Icon
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/side-bar/nav-main"
import { NavUser } from "@/components/side-bar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar"

// Sample data.
const data = {
  user: {
    name: "Admin",
    email: "m@example.com",
    avatar: User2Icon,
  },
  navMain: [
    {
      title: "Calculadoras",
      url: "/calculadoras",
      icon: Calculator,
    },
    {
      title: 'Parametros',
      url: '/parametros',
      icon: TextCursorInput,
    },
    {
      title: 'Unidades',
      url: '/unidades',
      icon: Box,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
