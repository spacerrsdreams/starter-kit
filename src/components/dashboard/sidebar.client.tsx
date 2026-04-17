"use client"

import * as React from "react"

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

export function Sidebar({ ...props }: React.ComponentProps<typeof SidebarComponent>) {
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
          <ChatDashboardSidebar />
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </SidebarComponent>
  )
}
