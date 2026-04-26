"use client"

import { useInfiniteQuery } from "@tanstack/react-query"

import { listChatsApi } from "@/features/ai/chat/api/chats.api"
import { authClient } from "@/features/auth/lib/auth-client"

const PAGE_LIMIT = 15
export const chatsQueryKey = "chat.list"

export const getChatsQueryKey = () => [chatsQueryKey] as const

export function useFetchChats() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)

  return useInfiniteQuery({
    queryKey: getChatsQueryKey(),
    initialPageParam: 0,
    queryFn: ({ pageParam }) => listChatsApi({ limit: PAGE_LIMIT, offset: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    enabled: !isSessionPending && isAuthenticated,
  })
}
