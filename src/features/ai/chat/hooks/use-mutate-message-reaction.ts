"use client"

import { useMutation } from "@tanstack/react-query"

import { setMessageReactionApi } from "@/features/ai/chat/api/chats.api"
import type { ChatMessageReaction } from "@/features/ai/chat/types/chat-message-reaction.types"

type SetMessageReactionInput = {
  chatId: string
  messageId: string
  reaction: ChatMessageReaction | null
}

export function useMutateMessageReaction() {
  return useMutation({
    mutationFn: ({ chatId, messageId, reaction }: SetMessageReactionInput) =>
      setMessageReactionApi(chatId, messageId, reaction),
  })
}

