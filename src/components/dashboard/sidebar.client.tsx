"use client"

import * as React from "react"

import { authClient } from "@/lib/auth/auth-client"
import { ChatDashboardSidebar } from "@/features/ai/chat/components/chat-dashboard-sidebar/chat-dashboard-sidebar.client"
import { SidebarUpgradeCta } from "@/features/billing/components/sidebar-upgrade-cta/sidebar-upgrade-cta.client"
import { SidebarFooterUserAction } from "@/components/dashboard/sidebar-footer-user-action.client"
import { SidebarLogo } from "@/components/sidebar-logo"
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { SearchForm } from "./search-form"

export function Sidebar({ ...props }: React.ComponentProps<typeof SidebarComponent>) {
  const { data: session, isPending: isSessionPending } = authClient.useSession()

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
        <SidebarGroup className="flex min-h-0 flex-1 flex-col space-y-1">
          <div className="hidden md:block">
            <SearchForm />
          </div>
          <ChatDashboardSidebar />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-0">
        <div className="space-y-2">
          <div className="px-2">
            <SidebarUpgradeCta />
          </div>
          <div className="border-t pt-2">
            <SidebarFooterUserAction isSessionPending={isSessionPending} session={session} />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </SidebarComponent>
  )
}
