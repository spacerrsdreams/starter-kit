"use client"

import { cn } from "@/lib/utils"
import type { ChatSessionUserMessageProps } from "@/features/ai/chat/types/chat-session-user-message.types"
import { Attachment, AttachmentInfo, AttachmentPreview, Attachments } from "@/components/ai-elements/attachments"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"

export function ChatSessionUserMessage({ message }: ChatSessionUserMessageProps) {
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
    </Message>
  )
}
