import { ApiRoutes } from "@/lib/api.routes"
import { apiRequest } from "@/lib/http-client"
import type { ChatsListResponse, CreateChatResponse, GetChatResponse } from "@/features/ai/chat/types/chat-api.types"
import type { SetMessageReactionPayload } from "@/features/ai/chat/types/chat-message-reaction-api.types"
import type { ChatMessageReaction } from "@/features/ai/chat/types/chat-message-reaction.types"

type ListChatsApiParams = {
  limit: number
  offset: number
}

export async function listChatsApi({ limit, offset }: ListChatsApiParams): Promise<ChatsListResponse> {
  const searchParams = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })
  return apiRequest<ChatsListResponse>(`${ApiRoutes.chats.list}?${searchParams.toString()}`)
}

export async function createChatApi(): Promise<CreateChatResponse> {
  return apiRequest<CreateChatResponse>(ApiRoutes.chats.create, { method: "POST" })
}

export async function getChatApi(id: string): Promise<GetChatResponse> {
  return apiRequest<GetChatResponse>(ApiRoutes.chats.get(id))
}

export async function deleteChatApi(id: string): Promise<void> {
  await apiRequest<unknown>(ApiRoutes.chats.delete(id), { method: "DELETE" })
}

type UpdateChatApiPayload = {
  title?: string
  isSaved?: boolean
}

export async function updateChatApi(id: string, payload: UpdateChatApiPayload): Promise<void> {
  await apiRequest<unknown>(ApiRoutes.chats.get(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function setMessageReactionApi(
  chatId: string,
  messageId: string,
  reaction: ChatMessageReaction | null,
  feedbackText?: string | null
): Promise<void> {
  const body = { reaction, feedbackText } satisfies SetMessageReactionPayload

  await apiRequest<unknown>(ApiRoutes.chats.setMessageReaction(chatId, messageId), {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}
