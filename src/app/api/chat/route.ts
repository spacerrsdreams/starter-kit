import "server-only"

import {
  consumeStream,
  convertToModelMessages,
  createIdGenerator,
  stepCountIs,
  streamText,
  validateUIMessages,
  type UIMessage,
} from "ai"
import { z } from "zod"

import { getSessionUserId } from "@/lib/auth/auth"
import { CHAT_SYSTEM_PROMPT } from "@/features/ai/chat/constants/chat-system-prompt"
import {
  getChatWithMessages,
  maybeGenerateAiChatTitle,
  replaceMessagesForChat,
} from "@/features/ai/chat/repositories/chat.repository"

export const maxDuration = 300

const requestSchema = z.object({
  chatId: z.string().min(1),
  message: z.unknown().optional(),
})

const generateMessageId = createIdGenerator({
  prefix: "msg",
  size: 16,
})

export async function POST(req: Request) {
  const userId = await getSessionUserId()

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const parsed = requestSchema.safeParse(await req.json())

  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { chatId, message } = parsed.data
  const chat = await getChatWithMessages(chatId, userId)
  if (!chat) {
    return new Response(JSON.stringify({ error: "Chat not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const candidateMessages = message ? [...chat.messages, message] : chat.messages
  const messages = await validateUIMessages<UIMessage>({
    messages: candidateMessages,
  })

  const result = streamText({
    model: "anthropic/claude-3.7-sonnet",
    system: CHAT_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendSources: true,
    generateMessageId,
    consumeSseStream: consumeStream,
    onFinish: async ({ messages: finalMessages }) => {
      await replaceMessagesForChat(chatId, userId, finalMessages)
      await maybeGenerateAiChatTitle(chatId, userId, finalMessages)
    },
  })
}
