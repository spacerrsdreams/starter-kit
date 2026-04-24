"use client"

import { useQuery } from "@tanstack/react-query"

import { ApiError } from "@/lib/http-client"
import { getChatApi } from "@/features/ai/chat/api/chats.api"
import { chatQueryKeys } from "@/features/ai/chat/constants/chat-query-keys"
import { authClient } from "@/features/auth/lib/auth-client"

export function useFetchChatDetail(chatId: string | null) {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)

  return useQuery({
    queryKey: chatQueryKeys.chat(chatId ?? ""),
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
