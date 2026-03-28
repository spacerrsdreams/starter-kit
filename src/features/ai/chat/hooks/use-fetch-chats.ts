"use client"

import { useQuery } from "@tanstack/react-query"

import { listChatsApi } from "@/features/ai/chat/api/chats.api"
import { chatQueryKeys } from "@/features/ai/chat/constants/chat-query-keys"

export function useFetchChats(enabled = true) {
  return useQuery({
    queryKey: chatQueryKeys.chats(),
    queryFn: listChatsApi,
    enabled,
  })
}
