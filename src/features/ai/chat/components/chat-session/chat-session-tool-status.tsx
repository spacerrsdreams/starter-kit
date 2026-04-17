"use client"

import { BadgeCheckIcon, LoaderCircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ChatSessionToolStatusProps } from "@/features/ai/chat/types/chat-tool-status.types"
import {
  getToolStatusLabel,
  isToolInvocationDone,
  isToolInvocationLoading,
} from "@/features/ai/chat/utils/chat-tool-status.utils"

export function ChatSessionToolStatus({ part }: ChatSessionToolStatusProps) {
  const label = getToolStatusLabel(part)
  const isLoading = isToolInvocationLoading(part)
  const isDone = isToolInvocationDone(part)

  return (
    <div
      className={cn(
        "inline-flex w-fit max-w-full items-center gap-1.5 text-xs text-muted-foreground",
        isLoading && "animate-pulse"
      )}
    >
      {isLoading ? <LoaderCircleIcon className="size-3 animate-spin" /> : null}
      {isDone ? <BadgeCheckIcon className="size-3" /> : null}
      {label}
    </div>
  )
}
