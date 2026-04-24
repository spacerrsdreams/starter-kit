import "server-only"

import {
  consumeStream,
  convertToModelMessages,
  createIdGenerator,
  generateText,
  stepCountIs,
  streamText,
  tool,
  validateUIMessages,
  type UIMessage,
} from "ai"
import { z } from "zod"

import { CHAT_SYSTEM_PROMPT } from "@/features/ai/chat/constants/chat-system-prompt"
import {
  getChatWithMessages,
  maybeGenerateAiChatTitle,
  replaceMessagesForChat,
  updateChatContextSummary,
} from "@/features/ai/chat/repositories/chat.repository"
import { buildAiContext } from "@/features/ai/chat/utils/build-ai-context.server"
import { buildBudgetedChatContext, buildSummaryTranscript } from "@/features/ai/chat/utils/chat-context-budget.utils"
import { getSessionUserId } from "@/features/auth/lib/auth"

export const maxDuration = 300

const CHAT_MODEL_ID = "anthropic/claude-3.7-sonnet"
const CONTEXT_BUDGET_MAX_CHARS = 20_000
const CONTEXT_BUDGET_RECENT_WINDOW_SIZE = 20
const PER_TURN_COST_CAP_USD = 0.02
const MODEL_INPUT_COST_PER_MILLION = 3
const MODEL_OUTPUT_COST_PER_MILLION = 15
const MAX_OUTPUT_TOKENS = 900
const INPUT_TOKENS_SAFETY_MARGIN = 0.85

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

function getMaxInputTokensFromCostBudget(): number {
  const reservedOutputCost = (MAX_OUTPUT_TOKENS * MODEL_OUTPUT_COST_PER_MILLION) / 1_000_000
  const remainingBudget = Math.max(0, PER_TURN_COST_CAP_USD - reservedOutputCost)
  const rawMaxInputTokens = Math.floor((remainingBudget * 1_000_000) / MODEL_INPUT_COST_PER_MILLION)

  return Math.max(500, Math.floor(rawMaxInputTokens * INPUT_TOKENS_SAFETY_MARGIN))
}

async function summarizeChatContext(existingSummary: string | null, messagesToSummarize: UIMessage[]): Promise<string> {
  const transcript = buildSummaryTranscript(messagesToSummarize)
  const summaryPrompt = `You are maintaining rolling chat memory.

Current summary:
${existingSummary?.trim() || "(none)"}

New transcript chunk:
${transcript}

Return an updated, compact summary that preserves:
- user preferences and constraints
- key facts and decisions
- unresolved tasks
- important tool outcomes

Use bullet points. Keep it under 1200 characters.`

  const { text } = await generateText({
    model: CHAT_MODEL_ID,
    prompt: summaryPrompt,
    temperature: 0.2,
  })

  return text.trim().slice(0, 1200)
}

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
  const maxInputTokens = getMaxInputTokensFromCostBudget()
  let contextSummary = chat.contextSummary
  let budgetedContext = buildBudgetedChatContext(messages, contextSummary, {
    maxContextChars: CONTEXT_BUDGET_MAX_CHARS,
    maxInputTokens,
    recentWindowSize: CONTEXT_BUDGET_RECENT_WINDOW_SIZE,
  })

  if (budgetedContext.shouldRefreshSummary && budgetedContext.messagesToSummarize.length > 0) {
    contextSummary = await summarizeChatContext(contextSummary, budgetedContext.messagesToSummarize)
    await updateChatContextSummary(chatId, userId, contextSummary)
    budgetedContext = buildBudgetedChatContext(messages, contextSummary, {
      maxContextChars: CONTEXT_BUDGET_MAX_CHARS,
      maxInputTokens,
      recentWindowSize: CONTEXT_BUDGET_RECENT_WINDOW_SIZE,
    })
  }

  const sharedAppContext = buildAiContext({
    currentPath: new URL(req.url).pathname,
  })

  const systemPrompt = [CHAT_SYSTEM_PROMPT, sharedAppContext].filter(Boolean).join("\n\n")

  const result = streamText({
    model: CHAT_MODEL_ID,
    system: systemPrompt,
    messages: await convertToModelMessages(budgetedContext.messagesForModel),
    tools: {
      weather: WeatherTool,
      hikePlaner: HikePlanerTool,
    },
    maxOutputTokens: MAX_OUTPUT_TOKENS,
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
