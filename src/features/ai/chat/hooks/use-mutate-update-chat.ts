"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InfiniteData } from "@tanstack/react-query"

import { updateChatApi } from "@/features/ai/chat/api/chats.api"
import { getChatDetailQueryKey } from "@/features/ai/chat/hooks/use-fetch-chat-detail"
import { getChatsQueryKey } from "@/features/ai/chat/hooks/use-fetch-chats"
import type { ChatsListResponse, GetChatResponse } from "@/features/ai/chat/types/chat-api.types"
import { authClient } from "@/features/auth/lib/auth-client"

type UpdateChatInput = {
  chatId: string
  title?: string
  isSaved?: boolean
}

export function useMutateUpdateChat() {
  const queryClient = useQueryClient()
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  return useMutation({
    mutationFn: async ({ chatId, ...payload }: UpdateChatInput) => {
      if (isSessionPending || !session?.user) {
        throw new Error("Authentication required")
      }
      return updateChatApi(chatId, payload)
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: getChatsQueryKey() })
      await queryClient.cancelQueries({ queryKey: getChatDetailQueryKey(variables.chatId) })

      const previousChats = queryClient.getQueryData<InfiniteData<ChatsListResponse>>(getChatsQueryKey())
      const previousChatDetail = queryClient.getQueryData<GetChatResponse>(getChatDetailQueryKey(variables.chatId))

      if (previousChats) {
        queryClient.setQueryData<InfiniteData<ChatsListResponse>>(getChatsQueryKey(), {
          ...previousChats,
          pages: previousChats.pages.map((page) => ({
            ...page,
            chats: page.chats.map((chat) =>
              chat.id === variables.chatId
                ? {
                    ...chat,
                    title: variables.title ?? chat.title,
                    isSaved: variables.isSaved ?? chat.isSaved,
                  }
                : chat
            ),
          })),
        })
      }

      if (previousChatDetail) {
        queryClient.setQueryData<GetChatResponse>(getChatDetailQueryKey(variables.chatId), {
          ...previousChatDetail,
          title: variables.title ?? previousChatDetail.title,
        })
      }

      return { previousChats, previousChatDetail }
    },
    onError: (_error, variables, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(getChatsQueryKey(), context.previousChats)
      }
      if (context?.previousChatDetail) {
        queryClient.setQueryData(getChatDetailQueryKey(variables.chatId), context.previousChatDetail)
      }
    },
    onSettled: (_data, _error, variables) => {
      void queryClient.invalidateQueries({ queryKey: getChatsQueryKey() })
      void queryClient.invalidateQueries({ queryKey: getChatDetailQueryKey(variables.chatId) })
    },
  })
}
