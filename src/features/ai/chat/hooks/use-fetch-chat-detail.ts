"use client"

import { useQuery } from "@tanstack/react-query"

import { ApiError } from "@/lib/http-client"
import { getChatApi } from "@/features/ai/chat/api/chats.api"
import { authClient } from "@/features/auth/lib/auth-client"

export const chatDetailQueryKey = "chat.detail"

export const getChatDetailQueryKey = (chatId: string) => [chatDetailQueryKey, chatId] as const

export function useFetchChatDetail(chatId: string | null) {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)

  return useQuery({
    queryKey: getChatDetailQueryKey(chatId ?? ""),
    enabled: !isSessionPending && isAuthenticated && Boolean(chatId),
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
