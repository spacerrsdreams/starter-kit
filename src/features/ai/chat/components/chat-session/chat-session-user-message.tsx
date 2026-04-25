"use client"

import { Check, Copy, RefreshCcw } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import type { ChatSessionUserMessageProps } from "@/features/ai/chat/types/chat-session-user-message.types"
import { Attachment, AttachmentInfo, AttachmentPreview, Attachments } from "@/components/ai-elements/attachments"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

export function ChatSessionUserMessage({ message, canRetry, timeLabel, onCopy, onRetry }: ChatSessionUserMessageProps) {
  const t = useTranslations()
  const [isCopied, setIsCopied] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const [previewImage, setPreviewImage] = useState<{
    url: string
    name: string
    width?: number
    height?: number
  } | null>(null)
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 900 })
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const previewFrame = useMemo(() => {
    const maxWidth = viewportSize.width * 0.96
    const maxHeight = viewportSize.height * 0.9

    if (!previewImage?.width || !previewImage?.height) {
      return {
        width: maxWidth,
        height: maxHeight,
      }
    }

    const ratio = previewImage.width / previewImage.height
    let width = maxWidth
    let height = width / ratio

    if (height > maxHeight) {
      height = maxHeight
      width = height * ratio
    }

    return {
      width,
      height,
    }
  }, [previewImage?.height, previewImage?.width, viewportSize.height, viewportSize.width])

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const updateViewport = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateViewport()
    window.addEventListener("resize", updateViewport)
    return () => {
      window.removeEventListener("resize", updateViewport)
    }
  }, [])

  useEffect(() => {
    if (!previewImage || (previewImage.width && previewImage.height)) {
      return
    }

    const imageElement = new window.Image()
    imageElement.onload = () => {
      setPreviewImage((currentImage) => {
        if (!currentImage || currentImage.url !== previewImage.url) {
          return currentImage
        }

        return {
          ...currentImage,
          width: imageElement.naturalWidth,
          height: imageElement.naturalHeight,
        }
      })
    }
    imageElement.src = previewImage.url
  }, [previewImage])

  return (
    <Message from={message.role} className="w-fit max-w-[min(100%,32rem)] justify-end">
      {message.parts.some((part) => part.type === "file") && (
        <div className="mb-0 flex w-full">
          <Attachments className="w-fit pt-0 pl-0" variant="inline">
            {message.parts.map((part, partIndex) => {
              if (part.type !== "file") {
                return null
              }

              const fileData = {
                ...part,
                id: `${message.id}-file-${partIndex}`,
              }
              const isImageFile = part.mediaType.startsWith("image/")

              if (!isImageFile) {
                return (
                  <Attachment data={fileData} key={fileData.id}>
                    <AttachmentPreview />
                    <AttachmentInfo />
                  </Attachment>
                )
              }

              return (
                <button
                  key={fileData.id}
                  type="button"
                  className="flex w-fit justify-end rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => {
                    setPreviewImage({
                      url: fileData.url,
                      name: fileData.filename ?? "Image attachment",
                    })
                  }}
                >
                  <Attachment data={fileData}>
                    <AttachmentPreview />
                    <AttachmentInfo />
                  </Attachment>
                </button>
              )
            })}
          </Attachments>
        </div>
      )}
      <MessageContent className="min-w-0 flex-col gap-3">
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
      <Dialog open={previewImage !== null} onOpenChange={(nextOpen) => !nextOpen && setPreviewImage(null)}>
        <DialogContent
          className="w-fit p-2 max-sm:inset-auto max-sm:h-auto max-sm:w-fit max-sm:max-w-[96vw] max-sm:-translate-x-1/2 max-sm:-translate-y-1/2 max-sm:rounded-xl sm:max-w-[96vw] max-sm:[&>div]:max-w-none"
          closeButtonClassName="top-4 right-4 bg-background"
        >
          <DialogTitle className="sr-only">{previewImage?.name ?? "Image preview"}</DialogTitle>
          <DialogDescription className="sr-only">Expanded image preview</DialogDescription>
          {previewImage && (
            <div
              className="relative max-h-[90dvh] max-w-[96vw] overflow-hidden rounded-xl"
              style={{ width: previewFrame.width, height: previewFrame.height }}
            >
              <Image
                src={previewImage.url}
                alt={previewImage.name}
                fill
                className="rounded-xl object-contain"
                sizes="96vw"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Message>
  )
}
