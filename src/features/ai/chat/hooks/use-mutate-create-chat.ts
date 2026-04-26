"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createChatApi } from "@/features/ai/chat/api/chats.api"
import { getChatsQueryKey } from "@/features/ai/chat/hooks/use-fetch-chats"
import { authClient } from "@/features/auth/lib/auth-client"

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
      void queryClient.invalidateQueries({ queryKey: getChatsQueryKey() })
    },
  })
}
