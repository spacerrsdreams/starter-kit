import type { ChatListItem } from "@/features/ai/chat/types/chat-list.types"

export type AiWidgetHistoryDropdownProps = {
  chats: ChatListItem[]
  activeChatId: string | null
  isDeleting: boolean
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
}
