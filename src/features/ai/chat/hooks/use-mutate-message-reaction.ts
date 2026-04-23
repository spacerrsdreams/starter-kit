"use client"

import { useMutation } from "@tanstack/react-query"

import { authClient } from "@/lib/auth/auth-client"
import { setMessageReactionApi } from "@/features/ai/chat/api/chats.api"
import type { ChatMessageReaction } from "@/features/ai/chat/types/chat-message-reaction.types"

type SetMessageReactionInput = {
  chatId: string
  messageId: string
  reaction: ChatMessageReaction | null
  feedbackText?: string | null
}

export function useMutateMessageReaction() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  return useMutation({
    mutationFn: ({ chatId, messageId, reaction, feedbackText }: SetMessageReactionInput) => {
      if (isSessionPending || !session?.user) {
        throw new Error("Authentication required")
      }
      return setMessageReactionApi(chatId, messageId, reaction, feedbackText)
    },
  })
}
