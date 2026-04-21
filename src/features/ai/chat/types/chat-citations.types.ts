import type { UIMessage } from "ai"

import type { ChatMessageReaction } from "@/features/ai/chat/types/chat-message-reaction.types"

export type ChatCitationSource = {
  sourceId: string
  url: string
  title?: string
}

export type ChatSessionCitationsProps = {
  sources: ChatCitationSource[]
}

export type ChatSessionAssistantMessageProps = {
  message: UIMessage
  isAnimating: boolean
  canRetry: boolean
  showActionsByDefault: boolean
  reaction: ChatMessageReaction | null
  onCopy: () => Promise<void>
  onRetry: () => Promise<void>
  onToggleLike: () => Promise<void>
  onToggleUnlike: () => Promise<void>
  onSubmitUnlikeFeedback: (feedbackText: string) => Promise<void>
}
