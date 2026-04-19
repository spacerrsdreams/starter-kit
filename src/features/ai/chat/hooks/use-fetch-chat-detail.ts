"use client"

import { useQuery } from "@tanstack/react-query"

import { ApiError } from "@/lib/http-client"
import { getChatApi } from "@/features/ai/chat/api/chats.api"
import { chatQueryKeys } from "@/features/ai/chat/constants/chat-query-keys"

export function useFetchChatDetail(chatId: string | null, enabled = true) {
  return useQuery({
    queryKey: chatQueryKeys.chat(chatId ?? ""),
    enabled: enabled && Boolean(chatId),
    queryFn: () => getChatApi(chatId!),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) {
        return false
      }
      return failureCount < 2
    },
    refetchOnWindowFocus: false,
  })
}
