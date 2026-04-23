import type { UIMessage } from "ai"

import type { ChatListItem } from "@/features/ai/chat/types/chat-list.types"

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
