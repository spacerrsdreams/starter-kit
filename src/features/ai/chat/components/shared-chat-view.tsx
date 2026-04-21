import type { UIMessage } from "ai"

import { getChatToolInvocationPart } from "@/features/ai/chat/utils/chat-tool-status.utils"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import { LogoSvg } from "@/components/ui/icons/logo.icon"

type SharedChatViewProps = {
  title: string | null
  messages: UIMessage[]
}

export function SharedChatView({ title, messages }: SharedChatViewProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1 border-b pb-4">
        <h1 className="text-xl font-semibold">{title?.trim() || "Shared chat"}</h1>
        <p className="text-sm text-muted-foreground">Read-only conversation shared by the owner.</p>
      </div>
      <div className="space-y-5">
        {messages.map((message) => {
          const isAssistant = message.role === "assistant"
          if (!isAssistant && message.role !== "user") {
            return null
          }
          return (
            <Message key={message.id} from={message.role} className={isAssistant ? "pl-10" : undefined}>
              {isAssistant ? (
                <div className="absolute -top-[2px] -left-0.5 z-10 flex size-7 items-center justify-center rounded-sm border bg-input/20">
                  <LogoSvg iconSize={14} className="text-foreground!" />
                </div>
              ) : null}
              <MessageContent className="flex w-full min-w-0 flex-col gap-3">
                {message.parts.map((part, partIndex) => {
                  if (part.type === "text") {
                    return (
                      <MessageResponse key={partIndex} className="block w-full min-w-0">
                        {part.text}
                      </MessageResponse>
                    )
                  }
                  if (getChatToolInvocationPart(part)) {
                    return null
                  }
                  return null
                })}
              </MessageContent>
            </Message>
          )
        })}
      </div>
    </div>
  )
}
