"use client"

import { HomeIcon } from "lucide-react"
import { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { WebRoutes } from "@/lib/web.routes"
import { ChatDashboardSidebar } from "@/features/ai/chat/components/chat-dashboard-sidebar/chat-dashboard-sidebar.client"
import { SidebarLogo } from "@/components/sidebar-logo"
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { SearchForm } from "./search-form"

const data = {
  navMain: [
    {
      title: "Home",
      url: WebRoutes.root.path,
      icon: <HomeIcon />,
    },
  ],
}

export function Sidebar({ ...props }: React.ComponentProps<typeof SidebarComponent>) {
  const pathname = usePathname()

  const isNavItemActive = (path: string) => {
    if (path === WebRoutes.root.path) {
      return pathname === path
    }

    return pathname.startsWith(path)
  }

  return (
    <SidebarComponent className="border-r-0" {...props}>
      <SidebarHeader className="border-b pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <SidebarLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="space-y-1">
          <div className="hidden md:block">
            <SearchForm />
          </div>
          <SidebarMenu className="pt-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isNavItemActive(item.url) ? true : undefined}>
                  <Link href={item.url as Route}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <ChatDashboardSidebar />
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </SidebarComponent>
  )
}
