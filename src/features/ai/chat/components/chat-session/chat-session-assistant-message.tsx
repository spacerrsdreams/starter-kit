"use client"

import { ChatSessionCitations } from "@/features/ai/chat/components/chat-session/chat-session-citations"
import { ChatSessionToolStatus } from "@/features/ai/chat/components/chat-session/chat-session-tool-status"
import type { ChatSessionAssistantMessageProps } from "@/features/ai/chat/types/chat-citations.types"
import { getChatCitationSources } from "@/features/ai/chat/utils/chat-citations.utils"
import { getChatToolInvocationPart } from "@/features/ai/chat/utils/chat-tool-status.utils"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"

export function ChatSessionAssistantMessage({ message, isAnimating }: ChatSessionAssistantMessageProps) {
  const citationSources = getChatCitationSources(message)

  return (
    <Message key={message.id} from={message.role}>
      <MessageContent className="flex w-full min-w-0 flex-col gap-3">
        {message.parts.map((part, partIndex) => {
          console.log(part)
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
    </Message>
  )
}
