"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authClient } from "@/lib/auth/auth-client"
import { createChatApi } from "@/features/ai/chat/api/chats.api"
import { chatQueryKeys } from "@/features/ai/chat/constants/chat-query-keys"

export function useMutateCreateChat() {
  const queryClient = useQueryClient()
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  return useMutation({
    mutationFn: async () => {
      if (isSessionPending || !session?.user) {
        throw new Error("Authentication required")
      }
      return createChatApi()
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatQueryKeys.chats() })
    },
  })
}
