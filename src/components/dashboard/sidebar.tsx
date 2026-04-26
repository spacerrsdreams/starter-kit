"use client"

import { BookMarked, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { isPathWithinRoute, WebRoutes } from "@/lib/web.routes"
import { ChatDashboardSidebar } from "@/features/ai/chat/components/chat-dashboard-sidebar/chat-dashboard-sidebar"
import { authClient } from "@/features/auth/lib/auth-client"
import { NavLogo } from "@/components/dashboard/nav-logo"
import { SidebarFooterUserAction } from "@/components/dashboard/sidebar-footer-user-action"
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"

export function Sidebar({ ...props }: React.ComponentProps<typeof SidebarComponent>) {
  const t = useTranslations()
  const pathname = usePathname()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAdminRoute = isPathWithinRoute(pathname, WebRoutes.admin.path)
  const isBlogRoute = isPathWithinRoute(pathname, WebRoutes.blog.path)

  return (
    <SidebarComponent {...props}>
      <SidebarHeader className="pb-0">
        <SidebarMenuButton size="lg">
          <NavLogo />
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex min-h-0 flex-1 flex-col space-y-1">
          {session?.user?.role === "admin" && (
            <SidebarMenuButton asChild isActive={isAdminRoute}>
              <Link href={WebRoutes.admin.path}>
                <ShieldCheck className="size-4.5!" />
                <span className="font-medium text-sidebar-accent-foreground">{t("routes.admin")}</span>
              </Link>
            </SidebarMenuButton>
          )}

          <SidebarMenuButton asChild isActive={isBlogRoute}>
            <Link href={WebRoutes.blog.path}>
              <BookMarked className="size-4.5!" />
              <span className="font-medium text-sidebar-accent-foreground">{t("routes.blog")}</span>
            </Link>
          </SidebarMenuButton>

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
