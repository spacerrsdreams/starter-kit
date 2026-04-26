import type { UIMessage } from "ai"

import type { ChatListItem, ChatMessageReaction } from "@/features/ai/chat/types/chat.types"

export type ChatsListResponse = {
  chats: ChatListItem[]
  nextOffset: number | null
}

export type CreateChatResponse = {
  id: string
}

export type GetChatResponse = {
  id: string
  title: string | null
  messages: UIMessage[]
}

export type SetMessageReactionPayload = {
  reaction: ChatMessageReaction | null
  feedbackText?: string | null
}
