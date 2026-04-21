import type { ChatMessageReaction } from "@/features/ai/chat/types/chat-message-reaction.types"

export type SetMessageReactionPayload = {
  reaction: ChatMessageReaction | null
  feedbackText?: string | null
}

