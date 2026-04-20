"use client"

import { Check, ChevronRight, EllipsisIcon, Files, PlusIcon, Trash2Icon } from "lucide-react"
import { Route } from "next"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { WebRoutes } from "@/lib/web.routes"
import { NEW_CHAT_EVENT_NAME } from "@/features/ai/chat/constants/new-chat-event.constants"
import { useFetchChats } from "@/features/ai/chat/hooks/use-fetch-chats"
import { useMutateDeleteChat } from "@/features/ai/chat/hooks/use-mutate-delete-chat"
import { useChatNavigationStore } from "@/features/ai/chat/store/chat-navigation.store"
import type { ChatListItem } from "@/features/ai/chat/types/chat-list.types"
import { getChatRoute } from "@/features/ai/chat/utils/chat-routes.utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoSvg } from "@/components/ui/icons/logo.icon"
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function ChatDashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile, setOpenMobile } = useSidebar()
  const [pendingDeleteChatId, setPendingDeleteChatId] = useState<string | null>(null)
  const [copiedChatId, setCopiedChatId] = useState<string | null>(null)
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeChatId = useChatNavigationStore((state) => state.activeChatId)
  const chatsQuery = useFetchChats()
  const deleteChatMutation = useMutateDeleteChat()
  const chats = useMemo<ChatListItem[]>(
    () => chatsQuery.data?.pages.flatMap((page) => page.chats) ?? [],
    [chatsQuery.data?.pages]
  )

  const isAskAiRoute = pathname === WebRoutes.askAi.path || pathname.startsWith(`${WebRoutes.askAi.path}/`)

  useEffect(
    () => () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current)
      }
    },
    []
  )

  const handleCopyLink = async (chatPath: string, chatId: string) => {
    const fullUrl = `${window.location.origin}${chatPath}`
    try {
      await navigator.clipboard.writeText(fullUrl)
    } catch {
      toast.error("Could not copy link")
      return
    }
    if (copyResetTimeoutRef.current) {
      clearTimeout(copyResetTimeoutRef.current)
    }
    setCopiedChatId(chatId)
    toast.success("Link copied")
    copyResetTimeoutRef.current = setTimeout(() => {
      setCopiedChatId(null)
      copyResetTimeoutRef.current = null
    }, 2000)
  }

  const handleStartNewChat = () => {
    window.dispatchEvent(new CustomEvent(NEW_CHAT_EVENT_NAME))
    if (pathname !== WebRoutes.askAi.path) {
      router.push(WebRoutes.askAi.path as Route)
    }
  }

  return (
    <>
      <Collapsible defaultOpen={isAskAiRoute} className="group/collapsible flex min-h-0 flex-1 flex-col">
        <SidebarMenu>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <LogoSvg className="text-foreground/80!" />
                <span className="font-medium">Ask AI</span>
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
          </SidebarMenuItem>
        </SidebarMenu>
        <CollapsibleContent className="min-h-0 flex-1">
          <SidebarGroupContent className="flex min-h-0 flex-1 pt-1">
            <SidebarMenu className="min-h-0 flex-1 overflow-y-auto">
              <SidebarMenuItem>
                <SidebarMenuButton isActive={isAskAiRoute} asChild onClick={handleStartNewChat} className="pl-1">
                  <div role="button" className="flex w-full cursor-pointer items-center gap-2">
                    <div className="rounded-full bg-muted-foreground/15 p-1 font-medium">
                      <PlusIcon className="size-4" />
                    </div>
                    <span>New Chat</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="px-2 pt-3 text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                Recents
              </SidebarMenuItem>
              {chats.map((chat) => {
                const chatPath = getChatRoute(chat.id)
                const isActive =
                  pathname === chatPath || (pathname === WebRoutes.askAi.path && activeChatId === chat.id)
                const label = chat.title?.trim() || "Untitled chat"
                return (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive ? true : undefined}
                      className="group pr-8 transition-all duration-300 hover:text-[14.25px]"
                    >
                      <Link
                        href={chatPath as Route}
                        title={label}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false)
                          }
                        }}
                      >
                        <span
                          className={cn(
                            "truncate",
                            "font-medium group-hover:text-foreground",
                            isActive ? "text-foreground" : "text-foreground/80"
                          )}
                        >
                          {label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                    <div className="absolute top-1.5 right-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-5 cursor-pointer group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 md:opacity-0"
                            aria-label="Chat actions"
                            disabled={deleteChatMutation.isPending}
                            onClick={(event) => {
                              event.preventDefault()
                            }}
                          >
                            <EllipsisIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 min-w-44">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onSelect={(event) => {
                                event.preventDefault()
                                void handleCopyLink(chatPath, chat.id)
                              }}
                            >
                              <span className="relative flex size-4 shrink-0 items-center justify-center" aria-hidden>
                                <Files
                                  className={cn(
                                    "absolute size-4 transition-all duration-200 ease-out",
                                    copiedChatId === chat.id ? "scale-50 opacity-0" : "scale-100 opacity-100"
                                  )}
                                />
                                <Check
                                  className={cn(
                                    "absolute size-4 text-emerald-600 transition-all duration-200 ease-out dark:text-emerald-500",
                                    copiedChatId === chat.id ? "scale-100 opacity-100" : "scale-50 opacity-0"
                                  )}
                                  strokeWidth={2.5}
                                />
                              </span>
                              <span className="transition-colors duration-200">
                                {copiedChatId === chat.id ? "Copied" : "Copy link"}
                              </span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() => {
                                setPendingDeleteChatId(chat.id)
                              }}
                            >
                              <Trash2Icon />
                              Delete chat
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuItem>
                )
              })}
              {chatsQuery.hasNextPage ? (
                <SidebarMenuItem className="px-1 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 w-full justify-start text-xs text-muted-foreground"
                    disabled={chatsQuery.isFetchingNextPage}
                    onClick={() => {
                      void chatsQuery.fetchNextPage()
                    }}
                  >
                    {chatsQuery.isFetchingNextPage ? "Loading..." : "Load more"}
                  </Button>
                </SidebarMenuItem>
              ) : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
      <AlertDialog
        open={Boolean(pendingDeleteChatId)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteChatId(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The chat and all of its messages will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteChatMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteChatMutation.isPending}
              onClick={() => {
                const chatId = pendingDeleteChatId
                if (!chatId) {
                  return
                }
                void (async () => {
                  try {
                    await deleteChatMutation.mutateAsync(chatId)
                    const deletedPath = getChatRoute(chatId)
                    if (pathname === deletedPath) {
                      const nextChat = chats.find((chat) => chat.id !== chatId)
                      router.replace((nextChat ? getChatRoute(nextChat.id) : WebRoutes.askAi.path) as Route)
                    }
                    setPendingDeleteChatId(null)
                  } catch {
                    setPendingDeleteChatId(null)
                  }
                })()
              }}
            >
              {deleteChatMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
