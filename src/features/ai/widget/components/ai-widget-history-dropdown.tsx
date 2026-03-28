"use client"

import { CheckIcon, ChevronDownIcon, EllipsisIcon, LinkIcon, MessageSquareIcon, Trash2Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { getChatRoute } from "@/features/ai/chat/utils/chat-routes.utils"
import type { AiWidgetHistoryDropdownProps } from "@/features/ai/widget/types/ai-widget-history-dropdown.types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AiWidgetHistoryDropdown({
  chats,
  activeChatId,
  isDeleting,
  onSelectChat,
  onDeleteChat,
}: AiWidgetHistoryDropdownProps) {
  const activeChat = chats.find((chat) => chat.id === activeChatId)
  const triggerLabel = activeChat?.title?.trim() || "New chat"
  const handleCopyLink = async (chatId: string) => {
    const chatPath = getChatRoute(chatId)
    const fullUrl = `${window.location.origin}${chatPath}`
    try {
      await navigator.clipboard.writeText(fullUrl)
    } catch {
      return
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-fit max-w-[260px] justify-start gap-2 px-2">
          <span className="min-w-0 flex-1 truncate text-left" title={triggerLabel}>
            {triggerLabel}
          </span>
          <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        {chats.length === 0 ? (
          <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
            <MessageSquareIcon className="size-4" />
            No conversations yet
          </div>
        ) : (
          <ScrollArea className="max-h-80">
            <div className="space-y-1 p-1">
              {chats.map((chat) => {
                const isActive = chat.id === activeChatId
                const label = chat.title?.trim() || "Untitled chat"

                return (
                  <div
                    key={chat.id}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-1 py-1",
                      isActive ? "bg-muted/50" : "hover:bg-muted/30"
                    )}
                  >
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm"
                      onClick={() => {
                        onSelectChat(chat.id)
                      }}
                    >
                      <span className="truncate">{label}</span>
                      {isActive ? <CheckIcon className="ml-auto size-4 shrink-0" /> : null}
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Chat actions"
                          disabled={isDeleting}
                          onClick={(event) => {
                            event.preventDefault()
                          }}
                        >
                          <EllipsisIcon className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onSelect={() => {
                            void handleCopyLink(chat.id)
                          }}
                        >
                          <LinkIcon />
                          Copy link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => {
                            onDeleteChat(chat.id)
                          }}
                        >
                          <Trash2Icon />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
