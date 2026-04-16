import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai"
import { z } from "zod"

import { CHAT_MODEL } from "@/lib/ai"
import { getSessionUserId } from "@/lib/auth/auth"
import { CHAT_SYSTEM_PROMPT } from "@/features/ai/chat/constants/chat-system-prompt"
import {
  chatExists,
  maybeGenerateAiChatTitle,
  replaceMessagesForChat,
} from "@/features/ai/chat/repositories/chat.repository"

export const maxDuration = 300

const requestSchema = z.object({
  chatId: z.string().min(1),
  messages: z.array(z.unknown()),
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

  const { chatId, messages: rawMessages } = parsed.data

  const exists = await chatExists(chatId, userId)

  if (!exists) {
    return new Response(JSON.stringify({ error: "Chat not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const messages = rawMessages as UIMessage[]

  const result = streamText({
    model: CHAT_MODEL,
    system: CHAT_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages: finalMessages }) => {
      await replaceMessagesForChat(chatId, userId, finalMessages)
      await maybeGenerateAiChatTitle(chatId, userId, finalMessages)
    },
  })
}
