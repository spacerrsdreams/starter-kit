"use client"

import { Shield } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { authClient } from "@/lib/auth/auth-client"
import { WebRoutes } from "@/lib/web.routes"
import { ChatDashboardSidebar } from "@/features/ai/chat/components/chat-dashboard-sidebar/chat-dashboard-sidebar.client"
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
    <SidebarComponent {...props}>
      <SidebarHeader className="pb-0">
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
          <div className="hidden">
            <SearchForm />
          </div>
          {session?.user?.role === "admin" ? (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={WebRoutes.admin.path}>
                    <Shield />
                    <span>Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          ) : null}
          <ChatDashboardSidebar />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-0">
        <SidebarFooterUserAction isSessionPending={isSessionPending} session={session} />
      </SidebarFooter>
      <SidebarRail />
    </SidebarComponent>
  )
}
