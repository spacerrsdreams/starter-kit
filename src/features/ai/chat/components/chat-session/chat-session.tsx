"use client"

import { useChat } from "@ai-sdk/react"
import type { FileUIPart, UIMessage } from "ai"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { AssistantThinkingIndicator } from "@/features/ai/chat/components/chat-session/assistant-thinking-indicator"
import { ChatExamplePrompts } from "@/features/ai/chat/components/chat-session/chat-example-prompts"
import { ChatSessionAssistantMessage } from "@/features/ai/chat/components/chat-session/chat-session-assistant-message"
import { ChatSessionUserMessage } from "@/features/ai/chat/components/chat-session/chat-session-user-message"
import { useMutateCreateChat } from "@/features/ai/chat/hooks/use-mutate-create-chat"
import { useMutateMessageReaction } from "@/features/ai/chat/hooks/use-mutate-message-reaction"
import { useChatAuthRequiredStore } from "@/features/ai/chat/store/chat-auth-required.store"
import type { ChatMessageReaction } from "@/features/ai/chat/types/chat-message-reaction.types"
import type { ChatSessionProps } from "@/features/ai/chat/types/chat-session.types"
import { getMessageReaction } from "@/features/ai/chat/utils/chat-message-reaction.utils"
import { getMessageFileParts, getMessageTextContent } from "@/features/ai/chat/utils/chat-session-message.utils"
import { createStableChatTransport } from "@/features/ai/chat/utils/stable-chat-transport"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { usePlanPickerDialog } from "@/features/billing/components/plan-picker-dialog/plan-picker-dialog-context"
import { BILLING_TRACKING_EVENTS } from "@/features/billing/constants/billing-tracking.constants"
import { useFetchBillingSubscription } from "@/features/billing/hooks/use-fetch-billing-subscription"
import { trackBillingEvent } from "@/features/billing/utils/track-billing-event.client"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { Message, MessageContent } from "@/components/ai-elements/message"
import { Button } from "@/components/ui/button"
import { LogoIcon, LogoSvg } from "@/components/ui/icons/logo.icon"
import { useIsMobile } from "@/hooks/use-mobile"

import { ChatInputForm } from "./chat-input-form"

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
  const isMobile = useIsMobile()
  const [transportApi] = useState(() => createStableChatTransport())
  const createChatMutation = useMutateCreateChat()
  const messageReactionMutation = useMutateMessageReaction()
  const isSendInFlightRef = useRef(false)
  const wasGeneratingRef = useRef(false)
  const { openAuthModal } = useAuthRequiredModal()
  const planPickerDialog = usePlanPickerDialog()
  const subscriptionQuery = useFetchBillingSubscription()
  const isPaid = subscriptionQuery.data?.isPaid ?? false
  const { pendingPrompt, setPendingPrompt, clearPendingPrompt } = useChatAuthRequiredStore((state) => state)
  const [messageReactionOverrides, setMessageReactionOverrides] = useState<Record<string, ChatMessageReaction | null>>(
    {}
  )
  const [messageTimesById, setMessageTimesById] = useState<Record<string, number>>({})

  useEffect(() => {
    transportApi.setChatId(initialDbChatId)
  }, [initialDbChatId, transportApi])

  const { messages, sendMessage, setMessages, status, stop } = useChat({
    id: sessionClientId,
    messages: initialMessages,
    transport: transportApi.transport,
    onFinish: () => {
      onConversationUpdated()
    },
  })

  const isGenerating = status === "submitted" || status === "streaming"
  const lastIndex = messages.length - 1
  const chatId = transportApi.getChatId()

  useEffect(() => {
    if (wasGeneratingRef.current && !isGenerating) {
      isSendInFlightRef.current = false
    }
    wasGeneratingRef.current = isGenerating
  }, [isGenerating])

  useEffect(() => {
    setMessageReactionOverrides({})
  }, [chatId])

  useEffect(() => {
    setMessageTimesById((current) => {
      const next = { ...current }
      let hasChanged = false
      for (const message of messages) {
        if (!(message.id in next)) {
          next[message.id] = Date.now()
          hasChanged = true
        }
      }
      return hasChanged ? next : current
    })
  }, [messages])

  const getReactionForMessage = useCallback(
    (message: UIMessage): ChatMessageReaction | null =>
      message.id in messageReactionOverrides ? messageReactionOverrides[message.id] : getMessageReaction(message),
    [messageReactionOverrides]
  )

  const sendAuthorizedMessage = useCallback(
    async (text: string, files: FileUIPart[] = []) => {
      const normalizedText = text.trim()
      if ((!normalizedText && files.length === 0) || isGenerating || isSendInFlightRef.current) {
        return false
      }
      isSendInFlightRef.current = true
      try {
        if (!transportApi.getChatId()) {
          const created = await createChatMutation.mutateAsync()
          transportApi.setChatId(created.id)
          onChatCreated(created.id)
        }
        void sendMessage({ files, text: normalizedText })
        return true
      } catch {
        isSendInFlightRef.current = false
        return false
      }
    },
    [createChatMutation, isGenerating, onChatCreated, sendMessage, transportApi]
  )

  const updateMessageReaction = useCallback(
    async (message: UIMessage, nextReaction: ChatMessageReaction | null) => {
      const activeChatId = transportApi.getChatId()
      if (!activeChatId || !isAuthenticated) {
        return
      }
      const previousReaction = getReactionForMessage(message)
      setMessageReactionOverrides((current) => ({
        ...current,
        [message.id]: nextReaction,
      }))
      try {
        await messageReactionMutation.mutateAsync({
          chatId: activeChatId,
          messageId: message.id,
          reaction: nextReaction,
        })
      } catch {
        setMessageReactionOverrides((current) => ({
          ...current,
          [message.id]: previousReaction,
        }))
        toast.error("Could not save reaction")
      }
    },
    [getReactionForMessage, isAuthenticated, messageReactionMutation, transportApi]
  )

  const handleMessageCopy = useCallback(async (message: UIMessage) => {
    const text = getMessageTextContent(message)
    if (!text) {
      toast.error("Nothing to copy")
      return
    }
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      toast.error("Could not copy message")
      throw new Error("copy-failed")
    }
  }, [])

  const retryFromUserMessage = useCallback(
    async (userMessage: UIMessage) => {
      if (isGenerating) {
        return
      }
      const targetIndex = messages.findIndex((message) => message.id === userMessage.id)
      if (targetIndex < 0 || targetIndex !== messages.length - 1 || messages[targetIndex]?.role !== "user") {
        return
      }
      const text = getMessageTextContent(userMessage)
      const files = getMessageFileParts(userMessage)
      setMessages(messages.slice(0, targetIndex))
      await sendAuthorizedMessage(text, files)
    },
    [isGenerating, messages, sendAuthorizedMessage, setMessages]
  )

  const retryFromAssistantMessage = useCallback(
    async (assistantMessage: UIMessage) => {
      if (isGenerating) {
        return
      }
      const assistantIndex = messages.findIndex((message) => message.id === assistantMessage.id)
      if (
        assistantIndex < 0 ||
        assistantIndex !== messages.length - 1 ||
        messages[assistantIndex]?.role !== "assistant"
      ) {
        return
      }
      let previousUserIndex = -1
      for (let index = assistantIndex - 1; index >= 0; index -= 1) {
        if (messages[index]?.role === "user") {
          previousUserIndex = index
          break
        }
      }
      if (previousUserIndex < 0) {
        return
      }
      const previousUserMessage = messages[previousUserIndex]
      const text = getMessageTextContent(previousUserMessage)
      const files = getMessageFileParts(previousUserMessage)
      setMessages(messages.slice(0, previousUserIndex))
      await sendAuthorizedMessage(text, files)
    },
    [isGenerating, messages, sendAuthorizedMessage, setMessages]
  )

  const latestMessageId = useMemo(() => messages[lastIndex]?.id ?? null, [lastIndex, messages])
  const latestAssistantMessageId = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index]?.role === "assistant") {
        return messages[index].id
      }
    }
    return null
  }, [messages])
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }),
    []
  )
  const getMessageTimeLabel = useCallback(
    (messageId: string) => {
      const timestamp = messageTimesById[messageId] ?? Date.now()
      return timeFormatter.format(new Date(timestamp))
    },
    [messageTimesById, timeFormatter]
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

  const handleSubmit = useCallback(
    async ({ text, files }: { text: string; files: FileUIPart[] }) => {
      const normalizedText = text.trim()
      if ((!normalizedText && files.length === 0) || isGenerating) {
        return
      }
      if (!isAuthenticated) {
        setPendingPrompt(normalizedText)
        openAuthModal()
        return
      }
      await sendAuthorizedMessage(normalizedText, files)
    },
    [isGenerating, isAuthenticated, setPendingPrompt, openAuthModal, sendAuthorizedMessage]
  )

  const showUpgradePill = isMobile && isAuthenticated && subscriptionQuery.isSuccess && !isPaid

  const handleUpgradeClick = useCallback(() => {
    planPickerDialog?.openPlanPickerDialog()
    trackBillingEvent({
      type: BILLING_TRACKING_EVENTS.ctaClicked,
      source: "sidebar_upgrade_cta",
      plan: "free",
    })
  }, [planPickerDialog])

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {messages.length === 0 && showUpgradePill ? (
        <div className="shrink-0 px-4 pt-2">
          <div className="flex justify-center">
            <Button
              type="button"
              variant="secondary"
              className="h-8 rounded-full bg-violet-100 px-3 text-xs leading-4 font-semibold text-violet-900 hover:bg-violet-200 dark:bg-violet-500/20 dark:text-violet-200 dark:hover:bg-violet-500/30"
              onClick={handleUpgradeClick}
              disabled={planPickerDialog?.isPlanPickerCheckoutLoading}
            >
              <LogoSvg className="mr-1 size-3.5 text-violet-600!" />
              Get Plus
            </Button>
          </div>
        </div>
      ) : null}
      <Conversation className="min-h-0 flex-1 overflow-hidden">
        <ConversationContent
          className={cn("flex min-h-0 flex-col", messages.length === 0 ? "h-full justify-center" : undefined)}
        >
          {messages.length === 0 ? (
            <ConversationEmptyState
              className={cn("min-h-0 flex-1 gap-2", compactMode && "w-full items-center justify-center text-center")}
            >
              <LogoIcon size={20} />
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
              const reaction = getReactionForMessage(message)
              const canRetry = !isGenerating && message.id === latestMessageId
              return (
                <ChatSessionAssistantMessage
                  key={message.id}
                  message={message}
                  isAnimating={status === "streaming" && index === lastIndex}
                  canRetry={canRetry}
                  showActionsByDefault={!isGenerating && message.id === latestAssistantMessageId}
                  reaction={reaction}
                  onCopy={() => handleMessageCopy(message)}
                  onRetry={() => retryFromAssistantMessage(message)}
                  onToggleLike={() => updateMessageReaction(message, reaction === "like" ? null : "like")}
                  onToggleUnlike={() => updateMessageReaction(message, reaction === "unlike" ? null : "unlike")}
                />
              )
            }

            if (message.role !== "user") {
              return null
            }

            const canRetry = !isGenerating && message.id === latestMessageId
            return (
              <ChatSessionUserMessage
                key={message.id}
                message={message}
                canRetry={canRetry}
                timeLabel={getMessageTimeLabel(message.id)}
                onCopy={() => handleMessageCopy(message)}
                onRetry={() => retryFromUserMessage(message)}
              />
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

      <div className={cn("shrink-0 px-4 pt-3 pb-1 sm:pb-4.5", messages.length === 0 ? "pt-2" : undefined)}>
        {messages.length === 0 ? (
          <ChatExamplePrompts
            disabled={isGenerating || createChatMutation.isPending}
            prompts={examplePrompts}
            layout={examplePromptsLayout}
            onSelect={(text) => {
              void handleSubmit({ files: [], text })
            }}
          />
        ) : null}
        <ChatInputForm isInputLocked={isGenerating} onStop={stop} onSubmit={handleSubmit} status={status} />
      </div>
    </div>
  )
}
