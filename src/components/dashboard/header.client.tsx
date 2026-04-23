"use client"

import { PlusIcon, UserRoundCheck } from "lucide-react"
import type { Route } from "next"
import { usePathname, useRouter } from "next/navigation"
import { useMemo, useTransition } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { WebRoutes } from "@/lib/web.routes"
import { NEW_CHAT_EVENT_NAME } from "@/features/ai/chat/constants/new-chat-event.constants"
import { useFetchChats } from "@/features/ai/chat/hooks/use-fetch-chats"
import { useChatNavigationStore } from "@/features/ai/chat/store/chat-navigation.store"
import { SidebarLogo } from "@/components/sidebar-logo"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, refetch: refetchSession } = authClient.useSession()
  const [isPending, startTransition] = useTransition()
  const activeChatId = useChatNavigationStore((state) => state.activeChatId)
  const chatsQuery = useFetchChats()
  const chats = useMemo(() => chatsQuery.data?.pages.flatMap((page) => page.chats) ?? [], [chatsQuery.data?.pages])
  const currentRoute = Object.values(WebRoutes).find((route) => "path" in route && route.path === pathname)
  const isAskAiRoute = pathname === WebRoutes.dashboard.path || pathname.startsWith(`${WebRoutes.dashboard.path}/`)
  const chatIdFromPath = pathname.startsWith(`${WebRoutes.dashboard.path}/`)
    ? pathname.slice(`${WebRoutes.dashboard.path}/`.length)
    : null
  const selectedChatId = activeChatId ?? chatIdFromPath
  const selectedChatTitle = chats.find((chat) => chat.id === selectedChatId)?.title?.trim() || ""
  const currentLabel = isAskAiRoute ? selectedChatTitle || "New Chat" : (currentRoute?.label ?? "Dashboard")

  const handleNewChatClick = () => {
    window.dispatchEvent(new CustomEvent(NEW_CHAT_EVENT_NAME))
    if (pathname !== WebRoutes.dashboard.path) {
      router.push(WebRoutes.dashboard.path as Route)
    }
  }

  const handleStopImpersonation = () => {
    startTransition(async () => {
      try {
        await authClient.admin.stopImpersonating()
        await refetchSession()
        router.refresh()
        window.location.assign(WebRoutes.admin.path)
      } catch {
        // no-op
      }
    })
  }

  return (
    <header className="flex h-[57px] shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="hidden md:inline-flex" />
        <Separator orientation="vertical" className="mr-2 hidden md:block data-vertical:h-4 data-vertical:self-auto" />
        <div className="md:hidden">
          <SidebarLogo />
        </div>
        <div className="ml-auto flex items-center gap-1 md:hidden">
          {isAskAiRoute ? (
            <Button type="button" variant="ghost" size="icon" aria-label="New chat" onClick={handleNewChatClick}>
              <PlusIcon className="size-4" />
            </Button>
          ) : null}
          {isAskAiRoute ? <SidebarTrigger /> : null}
        </div>
        <Breadcrumb className="hidden md:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {session?.session?.impersonatedBy ? (
        <div className="mr-3 hidden md:flex">
          <Button
            variant="outline"
            size="sm"
            className="relative overflow-visible"
            onClick={handleStopImpersonation}
            disabled={isPending}
          >
            <UserRoundCheck className="mr-2 size-4" />
            {isPending ? "Switching back..." : "Stop impersonation"}
          </Button>
        </div>
      ) : null}
    </header>
  )
}
