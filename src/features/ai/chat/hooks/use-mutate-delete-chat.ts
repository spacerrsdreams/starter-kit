"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteChatApi } from "@/features/ai/chat/api/chats.api"
import { chatQueryKeys } from "@/features/ai/chat/constants/chat-query-keys"

export function useMutateDeleteChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteChatApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatQueryKeys.chats() })
    },
  })
}
