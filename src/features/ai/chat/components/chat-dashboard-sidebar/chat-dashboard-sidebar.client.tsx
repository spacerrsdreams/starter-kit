"use client"

import { ChevronRight, EllipsisIcon, Pencil, PlusIcon, Star, Trash2Icon } from "lucide-react"
import { Route } from "next"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { WebRoutes } from "@/lib/web.routes"
import { NEW_CHAT_EVENT_NAME } from "@/features/ai/chat/constants/new-chat-event.constants"
import { useFetchChats } from "@/features/ai/chat/hooks/use-fetch-chats"
import { useMutateDeleteChat } from "@/features/ai/chat/hooks/use-mutate-delete-chat"
import { useMutateUpdateChat } from "@/features/ai/chat/hooks/use-mutate-update-chat"
import { useChatNavigationStore } from "@/features/ai/chat/store/chat-navigation.store"
import type { ChatListItem } from "@/features/ai/chat/types/chat-list.types"
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
import { Input } from "@/components/ui/input"
import { Popover, PopoverAnchor, PopoverContent, PopoverHeader, PopoverTitle } from "@/components/ui/popover"
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
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null)
  const [renameTitle, setRenameTitle] = useState("")
  const activeChatId = useChatNavigationStore((state) => state.activeChatId)
  const chatsQuery = useFetchChats()
  const deleteChatMutation = useMutateDeleteChat()
  const updateChatMutation = useMutateUpdateChat()
  const chats = useMemo<ChatListItem[]>(
    () => chatsQuery.data?.pages.flatMap((page) => page.chats) ?? [],
    [chatsQuery.data?.pages]
  )

  const chatRoutePrefix = `${WebRoutes.dashboard.path}/ai`
  const isAskAiRoute =
    pathname === WebRoutes.dashboard.path || pathname === chatRoutePrefix || pathname.startsWith(`${chatRoutePrefix}/`)

  const savedChats = useMemo(() => chats.filter((chat) => chat.isSaved), [chats])
  const recentChats = useMemo(() => chats.filter((chat) => !chat.isSaved), [chats])

  const handleChatRename = async () => {
    const chatId = renamingChatId
    const title = renameTitle.trim()
    if (!chatId || !title) {
      return
    }
    try {
      await updateChatMutation.mutateAsync({ chatId, title })
      setRenamingChatId(null)
      setRenameTitle("")
    } catch {
      toast.error("Could not rename chat")
    }
  }

  const renderChatRow = (chat: ChatListItem) => {
    const chatPath = WebRoutes.chat(chat.id)
    const isActive = pathname === chatPath || (pathname === WebRoutes.dashboard.path && activeChatId === chat.id)
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
        <div className="absolute top-1.5 right-1 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="z-10 size-5 cursor-pointer group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 md:opacity-0"
                aria-label="Chat actions"
                disabled={deleteChatMutation.isPending || updateChatMutation.isPending}
              >
                <EllipsisIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 min-w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={async (event) => {
                    event.preventDefault()
                    try {
                      await updateChatMutation.mutateAsync({ chatId: chat.id, isSaved: !chat.isSaved })
                    } catch {
                      toast.error("Could not update saved status")
                    }
                  }}
                >
                  <Star className={cn(chat.isSaved ? "fill-current text-amber-500" : undefined)} />
                  {chat.isSaved ? "Remove from saved" : "Save chat"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault()
                    setRenamingChatId(chat.id)
                    setRenameTitle(label)
                  }}
                >
                  <Pencil />
                  Rename chat
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
        <Popover
          modal
          open={renamingChatId === chat.id}
          onOpenChange={(open) => {
            if (!open) {
              setRenamingChatId(null)
            }
          }}
        >
          <PopoverAnchor asChild>
            <div className="absolute top-1.5 right-1 size-5" />
          </PopoverAnchor>
          <PopoverContent align="start" side="bottom" className="w-80">
            <PopoverHeader>
              <PopoverTitle>Rename chat</PopoverTitle>
            </PopoverHeader>
            <form
              className="space-y-2"
              onSubmit={(event) => {
                event.preventDefault()
                void handleChatRename()
              }}
            >
              <Input
                value={renameTitle}
                onChange={(event) => setRenameTitle(event.target.value)}
                maxLength={120}
                autoFocus
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={updateChatMutation.isPending || !renameTitle.trim()}>
                  Save
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    )
  }

  const handleStartNewChat = () => {
    window.dispatchEvent(new CustomEvent(NEW_CHAT_EVENT_NAME))
    if (pathname !== WebRoutes.dashboard.path) {
      router.push(WebRoutes.dashboard.path as Route)
    }
  }

  return (
    <>
      <SidebarGroupContent className="flex min-h-0 flex-1">
        <SidebarMenu className="min-h-0 flex-1 gap-1 overflow-y-auto">
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
          {savedChats.length > 0 ? (
            <>
              <SidebarMenuItem className="px-2 pt-3 text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                Saved chats
              </SidebarMenuItem>
              {savedChats.map(renderChatRow)}
            </>
          ) : null}
          <Collapsible defaultOpen={isAskAiRoute} className="group/recents-collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <span className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                    Recents
                  </span>
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/recents-collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>{recentChats.map(renderChatRow)}</CollapsibleContent>
          </Collapsible>
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
                    const deletedPath = WebRoutes.chat(chatId)
                    if (pathname === deletedPath) {
                      const nextChat = chats.find((chat) => chat.id !== chatId)
                      router.replace((nextChat ? WebRoutes.chat(nextChat.id) : WebRoutes.dashboard.path) as Route)
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
