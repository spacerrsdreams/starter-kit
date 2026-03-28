"use client"

import { useQuery } from "@tanstack/react-query"

import { getChatApi } from "@/features/ai/chat/api/chats.api"
import { chatQueryKeys } from "@/features/ai/chat/constants/chat-query-keys"

export function useFetchChatDetail(chatId: string | null, enabled = true) {
  return useQuery({
    queryKey: chatQueryKeys.chat(chatId ?? ""),
    queryFn: () => getChatApi(chatId!),
    enabled: enabled && Boolean(chatId),
  })
}
