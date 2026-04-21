"use client"

import { Check, CheckIcon, ChevronDownIcon, EllipsisIcon, Files, MessageSquareIcon, Trash2Icon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { WebRoutes } from "@/lib/web.routes"
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
  const [copiedChatId, setCopiedChatId] = useState<string | null>(null)
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeChat = chats.find((chat) => chat.id === activeChatId)
  const triggerLabel = activeChat?.title?.trim() || "New chat"

  useEffect(
    () => () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current)
      }
    },
    []
  )

  const handleCopyLink = async (chatId: string) => {
    const chatPath = WebRoutes.chat(chatId)
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
                          onSelect={(event) => {
                            event.preventDefault()
                            void handleCopyLink(chat.id)
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
                            {copiedChatId === chat.id ? "Copied!" : "Copy link"}
                          </span>
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
