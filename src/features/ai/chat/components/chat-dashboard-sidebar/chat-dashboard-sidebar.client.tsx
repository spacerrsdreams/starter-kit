"use client"

import { ChevronRight, EllipsisIcon, LinkIcon, PlusIcon, SparklesIcon, Trash2Icon } from "lucide-react"
import { Route } from "next"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { WebRoutes } from "@/lib/web.routes"
import { NEW_CHAT_EVENT_NAME } from "@/features/ai/chat/constants/new-chat-event.constants"
import { useFetchChats } from "@/features/ai/chat/hooks/use-fetch-chats"
import { useMutateDeleteChat } from "@/features/ai/chat/hooks/use-mutate-delete-chat"
import { useChatNavigationStore } from "@/features/ai/chat/store/chat-navigation.store"
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
import { SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function ChatDashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [pendingDeleteChatId, setPendingDeleteChatId] = useState<string | null>(null)
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)
  const activeChatId = useChatNavigationStore((state) => state.activeChatId)
  const chatsQuery = useFetchChats(isAuthenticated && !isSessionPending)
  const deleteChatMutation = useMutateDeleteChat()
  const chats = chatsQuery.data ?? []

  const isAskAiRoute = pathname === WebRoutes.askAi.path || pathname.startsWith(`${WebRoutes.askAi.path}/`)

  const handleCopyLink = async (chatPath: string) => {
    const fullUrl = `${window.location.origin}${chatPath}`
    try {
      await navigator.clipboard.writeText(fullUrl)
    } catch {
      return
    }
  }

  const handleStartNewChat = () => {
    window.dispatchEvent(new CustomEvent(NEW_CHAT_EVENT_NAME))
    if (pathname !== WebRoutes.askAi.path) {
      router.push(WebRoutes.askAi.path as Route)
    }
  }

  return (
    <>
      <Collapsible defaultOpen={isAskAiRoute} className="group/collapsible">
        <SidebarMenu>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <SparklesIcon />
                <span>Ask AI</span>
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
          </SidebarMenuItem>
        </SidebarMenu>
        <CollapsibleContent>
          <SidebarGroupContent className="pt-1 pl-1">
            <SidebarMenu className="max-h-64 overflow-y-auto">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === WebRoutes.askAi.path && !activeChatId ? true : undefined}
                >
                  <button type="button" className="flex w-full items-center gap-2" onClick={handleStartNewChat}>
                    <span>New Chat</span>
                    <PlusIcon className="ml-auto size-4" />
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {chats.map((chat) => {
                const chatPath = getChatRoute(chat.id)
                const isActive =
                  pathname === chatPath || (pathname === WebRoutes.askAi.path && activeChatId === chat.id)
                const label = chat.title?.trim() || "Untitled chat"
                return (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild isActive={isActive ? true : undefined} className="pr-8">
                      <Link href={chatPath as Route} title={label}>
                        <span className="truncate">{label}</span>
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
                              onSelect={() => {
                                void handleCopyLink(chatPath)
                              }}
                            >
                              <LinkIcon />
                              Copy link
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
