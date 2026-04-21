"use client"

import { MessageSquareText } from "lucide-react"
import type { ReactNode } from "react"

import { SidebarLogo } from "@/components/sidebar-logo"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type SharedChatShellProps = {
  title: string
  children: ReactNode
}

export function SharedChatShell({ title, children }: SharedChatShellProps) {
  return (
    <SidebarProvider>
      <Sidebar>
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
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MessageSquareText />
                  <span>Ask AI</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <span className="truncate">{title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="pb-0">
        <header className="flex h-[57px] shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger className="hidden md:inline-flex" />
            <Separator orientation="vertical" className="mr-2 hidden md:block data-vertical:h-4 data-vertical:self-auto" />
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex h-[calc(100dvh-57px)] min-h-0">
          <main className="mx-auto flex min-h-0 max-w-3xl flex-1 flex-col px-4 pb-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
