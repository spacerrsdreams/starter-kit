import type { ChatListItem } from "@/features/ai/chat/types/chat-list.types"

export type ChatHistoryGroups = {
  today: ChatListItem[]
  last7Days: ChatListItem[]
  last30Days: ChatListItem[]
}

const DAY_IN_MS = 24 * 60 * 60 * 1000

export function groupChatsByUpdatedAt(chats: ChatListItem[], now: Date = new Date()): ChatHistoryGroups {
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const last7Start = todayStart - 7 * DAY_IN_MS
  const last30Start = todayStart - 30 * DAY_IN_MS

  const groups: ChatHistoryGroups = {
    today: [],
    last7Days: [],
    last30Days: [],
  }

  for (const chat of chats) {
    const updatedAtMs = new Date(chat.updatedAt).getTime()
    if (!Number.isFinite(updatedAtMs)) {
      continue
    }

    if (updatedAtMs >= todayStart) {
      groups.today.push(chat)
      continue
    }
    if (updatedAtMs >= last7Start) {
      groups.last7Days.push(chat)
      continue
    }
    if (updatedAtMs >= last30Start) {
      groups.last30Days.push(chat)
    }
  }

  return groups
}

