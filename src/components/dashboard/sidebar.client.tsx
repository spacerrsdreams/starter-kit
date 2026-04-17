"use client"

import dynamic from "next/dynamic"
import * as React from "react"

import { authClient } from "@/lib/auth/auth-client"
import { ChatDashboardSidebar } from "@/features/ai/chat/components/chat-dashboard-sidebar/chat-dashboard-sidebar.client"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { SidebarLogo } from "@/components/sidebar-logo"
import { Button } from "@/components/ui/button"
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
import { Skeleton } from "@/components/ui/skeleton"

import { SearchForm } from "./search-form"

const UserButton = dynamic(() => import("@/features/auth/components/user-button").then((module) => module.UserButton), {
  ssr: false,
  loading: () => (
    <div className="flex h-12 w-full items-center gap-2 px-2">
      <Skeleton className="size-8 rounded-full" />
      <div className="grid flex-1 gap-1">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="size-4 rounded-sm" />
    </div>
  ),
})

export function Sidebar({ ...props }: React.ComponentProps<typeof SidebarComponent>) {
  const authModalContext = useAuthRequiredModal()
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
        <SidebarGroup className="space-y-1">
          <div className="hidden md:block">
            <SearchForm />
          </div>
          <ChatDashboardSidebar />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        {isSessionPending ? (
          <div className="flex h-12 w-full items-center gap-2 px-2">
            <Skeleton className="size-8 rounded-full" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="size-4 rounded-sm" />
          </div>
        ) : session?.user ? (
          <div className="flex items-center justify-end">
            <UserButton user={session.user} />
          </div>
        ) : (
          <Button type="button" variant="outline" onClick={() => authModalContext?.openAuthModal()}>
            Sign in
          </Button>
        )}
      </SidebarFooter>
      <SidebarRail />
    </SidebarComponent>
  )
}
