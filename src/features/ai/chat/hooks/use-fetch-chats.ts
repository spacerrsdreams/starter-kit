"use client"

import { useInfiniteQuery } from "@tanstack/react-query"

import { listChatsApi } from "@/features/ai/chat/api/chats.api"
import { chatQueryKeys } from "@/features/ai/chat/constants/chat-query-keys"

const PAGE_LIMIT = 15

export function useFetchChats(enabled = true) {
  return useInfiniteQuery({
    queryKey: chatQueryKeys.chats(),
    initialPageParam: 0,
    queryFn: ({ pageParam }) => listChatsApi({ limit: PAGE_LIMIT, offset: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    enabled,
  })
}
