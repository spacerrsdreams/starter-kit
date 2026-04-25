"use client"

import { Check, Copy, RefreshCcw } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import type { ChatSessionUserMessageProps } from "@/features/ai/chat/types/chat-session-user-message.types"
import { Attachment, AttachmentInfo, AttachmentPreview, Attachments } from "@/components/ai-elements/attachments"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import { Button } from "@/components/ui/button"

export function ChatSessionUserMessage({ message, canRetry, timeLabel, onCopy, onRetry }: ChatSessionUserMessageProps) {
  const t = useTranslations()
  const [isCopied, setIsCopied] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current)
      }
    }
  }, [])

  return (
    <Message from={message.role} className="w-fit max-w-[min(100%,32rem)] justify-end">
      <MessageContent className="min-w-0 flex-col gap-3">
        {message.parts.some((part) => part.type === "file") ? (
          <Attachments className="max-w-full justify-end" variant="inline">
            {message.parts.map((part, partIndex) => {
              if (part.type !== "file") {
                return null
              }

              const fileData = {
                ...part,
                id: `${message.id}-file-${partIndex}`,
              }

              return (
                <Attachment data={fileData} key={fileData.id}>
                  <AttachmentPreview />
                  <AttachmentInfo />
                </Attachment>
              )
            })}
          </Attachments>
        ) : null}
        {message.parts.map((part, partIndex) => {
          if (part.type !== "text") {
            return null
          }

          return (
            <div key={partIndex} className={cn("block max-w-full min-w-0 shrink-0")}>
              <MessageResponse className={cn("block max-w-full min-w-0")}>{part.text}</MessageResponse>
            </div>
          )
        })}
      </MessageContent>
      <div className="-mt-1 flex items-center justify-end gap-1 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="text-xs">{timeLabel}</span>
        <div className="flex items-center justify-end gap-0 rounded-md bg-background/80 px-1 py-0.5">
          <Button
            size="icon"
            type="button"
            variant="ghost"
            className="size-7"
            aria-label={t("aiChat.session.actions.copyMessage")}
            onClick={() => {
              void (async () => {
                try {
                  await onCopy()
                  if (copyResetTimeoutRef.current) {
                    clearTimeout(copyResetTimeoutRef.current)
                  }
                  setIsCopied(true)
                  toast.success(t("aiChat.session.actions.copied"))
                  copyResetTimeoutRef.current = setTimeout(() => {
                    setIsCopied(false)
                    copyResetTimeoutRef.current = null
                  }, 2000)
                } catch {
                  return
                }
              })()
            }}
          >
            <span className="relative flex size-4 items-center justify-center" aria-hidden>
              <Copy
                className={cn(
                  "absolute size-4 transition-all duration-200 ease-out",
                  isCopied ? "scale-50 opacity-0" : "scale-100 opacity-100"
                )}
              />
              <Check
                className={cn(
                  "absolute size-4 text-emerald-600 transition-all duration-200 ease-out dark:text-emerald-500",
                  isCopied ? "scale-100 opacity-100" : "scale-50 opacity-0"
                )}
                strokeWidth={2.5}
              />
            </span>
          </Button>
          {canRetry ? (
            <Button
              size="icon"
              type="button"
              variant="ghost"
              className="size-7"
              aria-label={t("aiChat.session.actions.retryFromMessage")}
              disabled={isRetrying}
              onClick={() => {
                void (async () => {
                  setIsRetrying(true)
                  try {
                    await onRetry()
                  } finally {
                    setIsRetrying(false)
                  }
                })()
              }}
            >
              <RefreshCcw className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </Message>
  )
}
