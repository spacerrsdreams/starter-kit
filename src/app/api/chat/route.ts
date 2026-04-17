import "server-only"

import {
  consumeStream,
  convertToModelMessages,
  createIdGenerator,
  stepCountIs,
  streamText,
  tool,
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const WeatherTool = tool({
  description: "Get the weather in a location",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async ({ location }) => {
    await sleep(2500)
    console.log("Executing [ WEATHER_TOOL ] for location:", location + "\n\n")
    return {
      location,
      temperature: 72 + Math.floor(Math.random() * 21) - 10,
    }
  },
})

const HikePlanerTool = tool({
  description: "Plan a hike in a location",
  inputSchema: z.object({
    location: z.string().describe("The location to plan a hike for"),
  }),
  execute: async ({ location }) => {
    await sleep(2000)
    console.log("Executing [ HIKE_PLANER_TOOL ] for location:", location + "\n\n")
    return {
      location,
      hikePlan: "Hike plan for " + location + " is to hike the Mtatsminda mountain and then come back.",
    }
  },
})

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
    tools: {
      weather: WeatherTool,
      hikePlaner: HikePlanerTool,
    },
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
