import { ApiRoutes } from "@/lib/api.routes"
import { apiRequest } from "@/lib/http-client"
import type { ChatsListResponse, CreateChatResponse, GetChatResponse } from "@/features/ai/chat/types/chat-api.types"
import type { ChatListItem } from "@/features/ai/chat/types/chat-list.types"
import type { SetMessageReactionPayload } from "@/features/ai/chat/types/chat-message-reaction-api.types"
import type { ChatMessageReaction } from "@/features/ai/chat/types/chat-message-reaction.types"

export async function listChatsApi(): Promise<ChatListItem[]> {
  const response = await apiRequest<ChatsListResponse>(ApiRoutes.chats.list)
  return response.chats
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

export async function setMessageReactionApi(
  chatId: string,
  messageId: string,
  reaction: ChatMessageReaction | null
): Promise<void> {
  await apiRequest<unknown>(ApiRoutes.chats.setMessageReaction(chatId, messageId), {
    method: "PATCH",
    body: JSON.stringify({ reaction } satisfies SetMessageReactionPayload),
  })
}
