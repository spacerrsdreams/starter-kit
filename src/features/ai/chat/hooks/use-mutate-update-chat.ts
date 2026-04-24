"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InfiniteData } from "@tanstack/react-query"

import { updateChatApi } from "@/features/ai/chat/api/chats.api"
import { chatQueryKeys } from "@/features/ai/chat/constants/chat-query-keys"
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
      await queryClient.cancelQueries({ queryKey: chatQueryKeys.chats() })
      await queryClient.cancelQueries({ queryKey: chatQueryKeys.chat(variables.chatId) })

      const previousChats = queryClient.getQueryData<InfiniteData<ChatsListResponse>>(chatQueryKeys.chats())
      const previousChatDetail = queryClient.getQueryData<GetChatResponse>(chatQueryKeys.chat(variables.chatId))

      if (previousChats) {
        queryClient.setQueryData<InfiniteData<ChatsListResponse>>(chatQueryKeys.chats(), {
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
        queryClient.setQueryData<GetChatResponse>(chatQueryKeys.chat(variables.chatId), {
          ...previousChatDetail,
          title: variables.title ?? previousChatDetail.title,
        })
      }

      return { previousChats, previousChatDetail }
    },
    onError: (_error, variables, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(chatQueryKeys.chats(), context.previousChats)
      }
      if (context?.previousChatDetail) {
        queryClient.setQueryData(chatQueryKeys.chat(variables.chatId), context.previousChatDetail)
      }
    },
    onSettled: (_data, _error, variables) => {
      void queryClient.invalidateQueries({ queryKey: chatQueryKeys.chats() })
      void queryClient.invalidateQueries({ queryKey: chatQueryKeys.chat(variables.chatId) })
    },
  })
}
