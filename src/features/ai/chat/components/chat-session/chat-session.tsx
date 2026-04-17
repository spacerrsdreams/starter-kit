"use client"

import { useChat } from "@ai-sdk/react"
import type { FileUIPart } from "ai"
import { ArrowUpIcon, PlusIcon } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { AssistantThinkingIndicator } from "@/features/ai/chat/components/chat-session/assistant-thinking-indicator"
import { ChatExamplePrompts } from "@/features/ai/chat/components/chat-session/chat-example-prompts"
import { ChatSessionAssistantMessage } from "@/features/ai/chat/components/chat-session/chat-session-assistant-message"
import { ChatSessionUserMessage } from "@/features/ai/chat/components/chat-session/chat-session-user-message"
import { useMutateCreateChat } from "@/features/ai/chat/hooks/use-mutate-create-chat"
import { useChatAuthRequiredStore } from "@/features/ai/chat/store/chat-auth-required.store"
import type { ChatSessionProps } from "@/features/ai/chat/types/chat-session.types"
import { createStableChatTransport } from "@/features/ai/chat/utils/stable-chat-transport"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { Message, MessageContent } from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input"
import { SpeechInput } from "@/components/ai-elements/speech-input"
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
  const [transcript, setTranscript] = useState("")
  const [transportApi] = useState(() => createStableChatTransport())
  const createChatMutation = useMutateCreateChat()
  const attachments = usePromptInputAttachments()
  const promptController = usePromptInputController()
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
    async (text: string, files: FileUIPart[] = []) => {
      const normalizedText = text.trim()
      if ((!normalizedText && files.length === 0) || isGenerating) {
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
      void sendMessage({ files, text: normalizedText })
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

  const currentInput = promptController.textInput.value
  const hasPendingInput = currentInput.trim().length > 0 || attachments.files.length > 0
  const isSubmitPrimary = hasPendingInput && !isGenerating
  const isSubmitVisuallyDisabled = !hasPendingInput && !isGenerating

  const isSpeechInputDisabled = isGenerating || createChatMutation.isPending

  const handleTranscriptionChange = useCallback((text: string) => {
    setTranscript((prev) => {
      const newText = prev ? `${prev} ${text}` : text
      return newText
    })
  }, [])

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

            return <ChatSessionUserMessage key={message.id} message={message} />
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

      <div className={cn("shrink-0 bg-background px-4 pt-3 pb-1 md:pb-8", messages.length === 0 ? "pt-2" : undefined)}>
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
        <PromptInput onSubmit={handleSubmit}>
          {attachments.files.length > 0 ? (
            <Attachments className="w-full justify-start px-3 pt-3" variant="inline">
              {attachments.files.map((file) => (
                <Attachment data={file} key={file.id} onRemove={() => attachments.remove(file.id)}>
                  <AttachmentPreview />
                  <AttachmentInfo />
                  <AttachmentRemove />
                </Attachment>
              ))}
            </Attachments>
          ) : null}
          <PromptInputTools className="order-first self-end p-2">
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger tooltip="Add attachment">
                <PlusIcon className="size-4" />
              </PromptInputActionMenuTrigger>
              <PromptInputActionMenuContent className="w-48">
                <PromptInputActionAddAttachments className="whitespace-nowrap" />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
          </PromptInputTools>
          <PromptInputTextarea className="min-h-auto" placeholder="Ask me anything..." />
          <div className="order-last flex items-center gap-1 self-end p-2">
            <SpeechInput
              aria-label="Capture speech and send message"
              // onAudioRecorded={handleAudioRecorded}
              onTranscriptionChange={handleTranscriptionChange}
              size="icon"
              variant="outline"
            />
            <PromptInputSubmit
              aria-disabled={isSubmitVisuallyDisabled}
              className={cn(
                isSubmitPrimary ? "bg-primary text-primary-foreground hover:bg-primary/90" : undefined,
                isSubmitVisuallyDisabled ? "cursor-not-allowed opacity-50" : undefined
              )}
              onStop={stop}
              status={status}
            >
              <ArrowUpIcon className="size-4" />
            </PromptInputSubmit>
          </div>
        </PromptInput>
      </div>
    </div>
  )
}
