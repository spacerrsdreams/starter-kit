import type { ChatListItem } from "@/features/ai/chat/types/chat-list.types"
import type { UIMessage } from "ai"

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
  shareId?: string | null
  messages: UIMessage[]
}
