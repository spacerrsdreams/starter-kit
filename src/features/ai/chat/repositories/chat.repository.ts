import "server-only"

import { MessageReaction, Prisma } from "@/generated/prisma/client"
import type { Message as MessageRow } from "@/generated/prisma/client"
import type { UIMessage } from "ai"

import { prisma } from "@/lib/prisma"
import type { ChatMessageReaction } from "@/features/ai/chat/types/chat-message-reaction.types"
import { toClientMessageId, toStorageMessageId } from "@/features/ai/chat/utils/chat-message-storage.utils"
import { getMessageReaction, withMessageReaction } from "@/features/ai/chat/utils/chat-message-reaction.utils"
import { generateChatTitleFromUserMessage } from "@/features/ai/chat/utils/generate-chat-title"

function rowToUIMessage(row: MessageRow): UIMessage {
  const message = {
    id: toClientMessageId(row),
    role: row.role,
    parts: row.parts as UIMessage["parts"],
  }
  if (!row.reaction) {
    return message
  }
  return withMessageReaction(message, row.reaction)
}

export async function createChat(userId: string): Promise<{ id: string }> {
  const chat = await prisma.chat.create({ data: { userId } })
  return { id: chat.id }
}

export async function chatExists(chatId: string, userId: string): Promise<boolean> {
  const count = await prisma.chat.count({
    where: { id: chatId, userId },
  })

  return count > 0
}

export async function listChats(userId: string): Promise<Array<{ id: string; title: string | null; updatedAt: Date }>> {
  return prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  })
}

export async function deleteChat(chatId: string, userId: string): Promise<boolean> {
  const result = await prisma.chat.deleteMany({ where: { id: chatId, userId } })
  return result.count > 0
}

export async function getChatWithMessages(
  chatId: string,
  userId: string
): Promise<{ id: string; title: string | null; contextSummary: string | null; messages: UIMessage[] } | null> {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: { orderBy: [{ createdAt: "asc" }, { id: "asc" }] } },
  })
  if (!chat || chat.userId !== userId) {
    return null
  }
  return {
    id: chat.id,
    title: chat.title,
    contextSummary: chat.contextSummary,
    messages: chat.messages.map(rowToUIMessage),
  }
}

function dedupeMessagesByIdPreservingOrder(messages: UIMessage[]): UIMessage[] {
  const order: string[] = []
  const byId = new Map<string, UIMessage>()
  for (const message of messages) {
    if (!byId.has(message.id)) {
      order.push(message.id)
    }
    byId.set(message.id, message)
  }
  return order.map((id) => byId.get(id)).filter((message): message is UIMessage => Boolean(message))
}

export async function replaceMessagesForChat(chatId: string, userId: string, messages: UIMessage[]): Promise<void> {
  const uniqueMessages = dedupeMessagesByIdPreservingOrder(messages)
  const baseTime = Date.now()

  await prisma.$transaction(async (tx) => {
    const existingMessageReactions = await tx.message.findMany({
      where: { chatId, chat: { userId } },
      select: { id: true, reaction: true },
    })
    const reactionByMessageId = new Map(
      existingMessageReactions
        .filter((message): message is { id: string; reaction: MessageReaction } => Boolean(message.reaction))
        .map((message) => [message.id, message.reaction])
    )
    const rows = uniqueMessages.map((message, index) => {
      const storageMessageId = toStorageMessageId(chatId, message.id)
      const reaction = getMessageReaction(message) ?? reactionByMessageId.get(storageMessageId) ?? null
      return {
        id: storageMessageId,
        chatId,
        role: message.role,
        parts: message.parts as Prisma.InputJsonValue,
        reaction,
        createdAt: new Date(baseTime + index),
      }
    })
    await tx.message.deleteMany({ where: { chatId, chat: { userId } } })
    if (rows.length > 0) {
      await tx.message.createMany({ data: rows })
    }
    await tx.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    })
  })
}

export async function updateMessageReaction(
  chatId: string,
  userId: string,
  clientMessageId: string,
  reaction: ChatMessageReaction | null
): Promise<boolean> {
  const messageId = toStorageMessageId(chatId, clientMessageId)
  const result = await prisma.message.updateMany({
    where: {
      id: messageId,
      chatId,
      chat: {
        userId,
      },
    },
    data: {
      reaction,
    },
  })
  return result.count > 0
}

export async function maybeGenerateAiChatTitle(chatId: string, userId: string, messages: UIMessage[]): Promise<void> {
  const chat = await prisma.chat.findUnique({ where: { id: chatId } })
  if (!chat || chat.userId !== userId || chat.title) {
    return
  }
  const firstUser = messages.find((message) => message.role === "user")
  if (!firstUser) {
    return
  }
  const textPart = firstUser.parts.find((part) => part.type === "text")
  if (!textPart || textPart.type !== "text") {
    return
  }
  const raw = textPart.text.trim()
  if (!raw) {
    return
  }
  const title = await generateChatTitleFromUserMessage(raw)
  await prisma.chat.update({
    where: { id: chatId },
    data: { title },
  })
}

export async function updateChatContextSummary(chatId: string, userId: string, contextSummary: string | null): Promise<void> {
  await prisma.chat.updateMany({
    where: { id: chatId, userId },
    data: { contextSummary },
  })
}
