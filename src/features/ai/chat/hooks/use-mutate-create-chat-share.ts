"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authClient } from "@/lib/auth/auth-client"
import { createChatShareApi } from "@/features/ai/chat/api/chats.api"
import { chatQueryKeys } from "@/features/ai/chat/constants/chat-query-keys"

export function useMutateCreateChatShare() {
  const queryClient = useQueryClient()
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  return useMutation({
    mutationFn: async (chatId: string) => {
      if (isSessionPending || !session?.user) {
        throw new Error("Authentication required")
      }
      return createChatShareApi(chatId)
    },
    onSuccess: (_data, chatId) => {
      void queryClient.invalidateQueries({ queryKey: chatQueryKeys.chats() })
      void queryClient.invalidateQueries({ queryKey: chatQueryKeys.chat(chatId) })
    },
  })
}
