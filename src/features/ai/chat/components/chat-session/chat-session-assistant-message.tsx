"use client"

import { Check, Copy, RefreshCcw, ThumbsDown, ThumbsUp } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { ChatSessionCitations } from "@/features/ai/chat/components/chat-session/chat-session-citations"
import { ChatSessionToolStatus } from "@/features/ai/chat/components/chat-session/chat-session-tool-status"
import type { ChatSessionAssistantMessageProps } from "@/features/ai/chat/types/chat-citations.types"
import { getChatCitationSources } from "@/features/ai/chat/utils/chat-citations.utils"
import { getChatToolInvocationPart } from "@/features/ai/chat/utils/chat-tool-status.utils"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import { Button } from "@/components/ui/button"
import { LogoSvg } from "@/components/ui/icons/logo.icon"
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

export function ChatSessionAssistantMessage({
  message,
  isAnimating,
  canRetry,
  showActionsByDefault,
  reaction,
  onCopy,
  onRetry,
  onToggleLike,
  onToggleUnlike,
  onSubmitUnlikeFeedback,
}: ChatSessionAssistantMessageProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current)
      }
    }
  }, [])

  const citationSources = getChatCitationSources(message)

  return (
    <Message key={message.id} from={message.role} className="relative overflow-visible pl-10">
      <div className="absolute -top-[2px] -left-0.5 z-10 flex size-7 items-center justify-center rounded-sm border bg-input/20">
        <LogoSvg iconSize={14} className="text-foreground!" />
      </div>
      <MessageContent className="flex w-full min-w-0 flex-col gap-3">
        {message.parts.map((part, partIndex) => {
          switch (part.type) {
            case "text":
              return (
                <div key={partIndex} className="block w-full min-w-0 shrink-0">
                  <MessageResponse className="block w-full min-w-0" isAnimating={isAnimating}>
                    {part.text}
                  </MessageResponse>
                </div>
              )
            default:
              {
                const toolPart = getChatToolInvocationPart(part)
                if (toolPart) {
                  return <ChatSessionToolStatus key={partIndex} part={toolPart} />
                }
              }
              return null
          }
        })}
        <ChatSessionCitations sources={citationSources} />
      </MessageContent>
      {!isAnimating ? (
        <div
          className={cn(
            "-mt-1 -ml-0.5 flex items-center gap-1 text-muted-foreground transition-opacity duration-200",
            showActionsByDefault ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <div className="flex items-center gap-0 rounded-md bg-background/80 py-0.5">
            <Button
              size="icon"
              type="button"
              variant="ghost"
              className="size-7"
              aria-label="Copy message"
              onClick={() => {
                void (async () => {
                  try {
                    await onCopy()
                    if (copyResetTimeoutRef.current) {
                      clearTimeout(copyResetTimeoutRef.current)
                    }
                    setIsCopied(true)
                    toast.success("Copied")
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
                    "absolute size-4 transition-all duration-200 ease-out",
                    isCopied ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  )}
                />
              </span>
            </Button>
            <AnimatePresence mode="wait" initial={false}>
              {reaction === null ? (
                <motion.div
                  key="neutral-reaction"
                  className="flex items-center gap-0"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.16 }}
                >
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    className="size-7"
                    aria-label="Like message"
                    onClick={() => {
                      void onToggleLike()
                    }}
                  >
                    <ThumbsUp className="size-4" />
                  </Button>
                  <Popover open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                    <PopoverTrigger asChild>
                      <Button size="icon" type="button" variant="ghost" className="size-7" aria-label="Unlike message">
                        <ThumbsDown className="size-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-72">
                      <PopoverHeader>
                        <PopoverTitle>Tell us what was wrong</PopoverTitle>
                      </PopoverHeader>
                      <form
                        className="space-y-2"
                        onSubmit={(event) => {
                          event.preventDefault()
                          const trimmedFeedback = feedbackText.trim()
                          if (!trimmedFeedback) {
                            toast.error("Please add feedback")
                            return
                          }
                          void (async () => {
                            try {
                              await onSubmitUnlikeFeedback(trimmedFeedback)
                              setFeedbackText("")
                              setIsFeedbackOpen(false)
                            } catch {
                              return
                            }
                          })()
                        }}
                      >
                        <Textarea
                          value={feedbackText}
                          onChange={(event) => setFeedbackText(event.target.value)}
                          placeholder="Tell us why this response wasn't useful"
                          maxLength={500}
                          rows={3}
                        />
                        <div className="flex justify-end">
                          <Button type="submit" size="sm">
                            Submit
                          </Button>
                        </div>
                      </form>
                    </PopoverContent>
                  </Popover>
                </motion.div>
              ) : null}

              {reaction === "like" ? (
                <motion.div
                  key="like-reaction"
                  className="flex items-center"
                  initial={{ opacity: 0, x: -6, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 6, scale: 0.92 }}
                  transition={{ duration: 0.16 }}
                >
                  <Button
                    size="icon"
                    type="button"
                    variant="secondary"
                    className="size-7"
                    aria-label="Remove like"
                    onClick={() => {
                      void onToggleLike()
                    }}
                  >
                    <ThumbsUp className="size-4" />
                  </Button>
                </motion.div>
              ) : null}

              {reaction === "unlike" ? (
                <motion.div
                  key="unlike-reaction"
                  className="flex items-center"
                  initial={{ opacity: 0, x: 6, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -6, scale: 0.92 }}
                  transition={{ duration: 0.16 }}
                >
                  <Button
                    size="icon"
                    type="button"
                    variant="secondary"
                    className="size-7"
                    aria-label="Remove unlike"
                    onClick={() => {
                      void onToggleUnlike()
                    }}
                  >
                    <ThumbsDown className="size-4" />
                  </Button>
                </motion.div>
              ) : null}
            </AnimatePresence>
            {canRetry ? (
              <Button
                size="icon"
                type="button"
                variant="ghost"
                className="size-7"
                aria-label="Retry from this message"
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
      ) : null}
    </Message>
  )
}
