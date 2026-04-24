"use client"

import { ShieldCheck } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { WebRoutes } from "@/lib/web.routes"
import { ChatDashboardSidebar } from "@/features/ai/chat/components/chat-dashboard-sidebar/chat-dashboard-sidebar.client"
import { authClient } from "@/features/auth/lib/auth-client"
import { NavLogo } from "@/components/dashboard/nav-logo"
import { SidebarFooterUserAction } from "@/components/dashboard/sidebar-footer-user-action.client"
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

export function Sidebar({ ...props }: React.ComponentProps<typeof SidebarComponent>) {
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  return (
    <SidebarComponent {...props}>
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <NavLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex min-h-0 flex-1 flex-col space-y-1">
          {session?.user?.role === "admin" ? (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={WebRoutes.admin.path}>
                    <ShieldCheck className="size-4.5!" />
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
