"use client"

import { useChat } from "@ai-sdk/react"
import { useCallback, useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { AssistantThinkingIndicator } from "@/features/ai/chat/components/chat-session/assistant-thinking-indicator"
import { ChatExamplePrompts } from "@/features/ai/chat/components/chat-session/chat-example-prompts"
import { ChatSessionAssistantMessage } from "@/features/ai/chat/components/chat-session/chat-session-assistant-message"
import { useMutateCreateChat } from "@/features/ai/chat/hooks/use-mutate-create-chat"
import { useChatAuthRequiredStore } from "@/features/ai/chat/store/chat-auth-required.store"
import type { ChatSessionProps } from "@/features/ai/chat/types/chat-session.types"
import { createStableChatTransport } from "@/features/ai/chat/utils/stable-chat-transport"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input"
import { LogoIcon } from "@/components/ui/icons/logo"

export function ChatSession({
  sessionClientId,
  isAuthenticated = true,
  initialMessages,
  initialDbChatId,
  examplePrompts,
  examplePromptsLayout = "default",
  compactMode = false,
  onChatCreated,
  onConversationUpdated,
}: ChatSessionProps) {
  const [transportApi] = useState(() => createStableChatTransport())
  const createChatMutation = useMutateCreateChat()
  const { openAuthModal } = useAuthRequiredModal()
  const { pendingPrompt, setPendingPrompt, clearPendingPrompt } = useChatAuthRequiredStore((state) => state)

  useEffect(() => {
    transportApi.setChatId(initialDbChatId)
  }, [initialDbChatId, transportApi])

  const { messages, sendMessage, status, stop } = useChat({
    id: sessionClientId,
    messages: initialMessages,
    transport: transportApi.transport,
    onFinish: () => {
      onConversationUpdated()
    },
  })

  const isGenerating = status === "submitted" || status === "streaming"
  const lastIndex = messages.length - 1

  const sendAuthorizedMessage = useCallback(
    async (text: string) => {
      const normalizedText = text.trim()
      if (!normalizedText || isGenerating) {
        return false
      }
      if (!transportApi.getChatId()) {
        try {
          const created = await createChatMutation.mutateAsync()
          transportApi.setChatId(created.id)
          onChatCreated(created.id)
        } catch {
          return false
        }
      }
      void sendMessage({ text: normalizedText })
      return true
    },
    [createChatMutation, isGenerating, onChatCreated, sendMessage, transportApi]
  )

  useEffect(() => {
    if (!isAuthenticated || !pendingPrompt || isGenerating || createChatMutation.isPending) {
      return
    }
    void (async () => {
      const wasSent = await sendAuthorizedMessage(pendingPrompt)
      if (wasSent) {
        clearPendingPrompt()
      }
    })()
  }, [
    clearPendingPrompt,
    createChatMutation.isPending,
    isAuthenticated,
    isGenerating,
    pendingPrompt,
    sendAuthorizedMessage,
  ])

  const handleSubmit = async ({ text }: { text: string }) => {
    const normalizedText = text.trim()
    if (!normalizedText || isGenerating) {
      return
    }
    if (!isAuthenticated) {
      setPendingPrompt(normalizedText)
      openAuthModal()
      return
    }
    await sendAuthorizedMessage(normalizedText)
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <Conversation className="min-h-0 flex-1 overflow-hidden">
        <ConversationContent
          className={cn("flex min-h-0 flex-col", messages.length === 0 ? "h-full justify-center" : undefined)}
        >
          {messages.length === 0 ? (
            <ConversationEmptyState
              className={cn("min-h-0 flex-1 gap-2", compactMode && "w-full items-center justify-center text-center")}
            >
              <LogoIcon />
              <div className={cn("space-y-2", compactMode && "mx-auto w-full max-w-sm")}>
                <h3 className="text-sm font-medium">How can I help you?</h3>
                <p className={cn("max-w-md text-sm text-muted-foreground", compactMode && "mx-auto")}>
                  Chat with AI, keep history, and resume any previous conversation.
                </p>
              </div>
            </ConversationEmptyState>
          ) : null}

          {messages.map((message, index) => {
            if (message.role === "assistant") {
              return (
                <ChatSessionAssistantMessage
                  key={message.id}
                  message={message}
                  isAnimating={status === "streaming" && index === lastIndex}
                />
              )
            }

            return (
              <Message
                key={message.id}
                from={message.role}
                className={cn(message.role === "user" && "w-fit max-w-[min(100%,32rem)] justify-end")}
              >
                <MessageContent
                  className={cn(
                    message.role === "user" ? "min-w-0 flex-col gap-3" : "flex w-full min-w-0 flex-col gap-3"
                  )}
                >
                  {message.parts.map((part, partIndex) => {
                    if (part.type !== "text") {
                      return null
                    }
                    const isUser = message.role === "user"

                    return (
                      <div
                        key={partIndex}
                        className={cn("block min-w-0 shrink-0", isUser ? "max-w-full" : "w-full min-w-0")}
                      >
                        <MessageResponse
                          className={cn("block min-w-0", isUser ? "max-w-full" : "w-full")}
                          isAnimating={status === "streaming" && index === lastIndex && message.role === "assistant"}
                        >
                          {part.text}
                        </MessageResponse>
                      </div>
                    )
                  })}
                </MessageContent>
              </Message>
            )
          })}

          {status === "submitted" ? (
            <Message from="assistant">
              <MessageContent>
                <AssistantThinkingIndicator />
              </MessageContent>
            </Message>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className={cn("shrink-0 bg-background px-4 pt-3 pb-1 md:pb-4", messages.length === 0 ? "pt-2" : undefined)}>
        {messages.length === 0 ? (
          <ChatExamplePrompts
            disabled={isGenerating || createChatMutation.isPending}
            prompts={examplePrompts}
            layout={examplePromptsLayout}
            onSelect={(text) => {
              void handleSubmit({ text })
            }}
          />
        ) : null}
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea placeholder="Ask me anything..." />
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit onStop={stop} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}
