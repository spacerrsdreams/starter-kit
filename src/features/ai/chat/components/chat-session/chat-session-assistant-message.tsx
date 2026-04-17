"use client"

import { ChatSessionCitations } from "@/features/ai/chat/components/chat-session/chat-session-citations"
import type { ChatSessionAssistantMessageProps } from "@/features/ai/chat/types/chat-citations.types"
import { getChatCitationSources } from "@/features/ai/chat/utils/chat-citations.utils"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"

export function ChatSessionAssistantMessage({ message, isAnimating }: ChatSessionAssistantMessageProps) {
  const citationSources = getChatCitationSources(message)

  return (
    <Message key={message.id} from={message.role}>
      <MessageContent className="flex w-full min-w-0 flex-col gap-3">
        {message.parts.map((part, partIndex) => {
          if (part.type !== "text") {
            return null
          }

          return (
            <div key={partIndex} className="block w-full min-w-0 shrink-0">
              <MessageResponse className="block w-full min-w-0" isAnimating={isAnimating}>
                {part.text}
              </MessageResponse>
            </div>
          )
        })}
        <ChatSessionCitations sources={citationSources} />
      </MessageContent>
    </Message>
  )
}
