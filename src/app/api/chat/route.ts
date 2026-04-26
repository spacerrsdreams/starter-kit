import "server-only"

import { get } from "@vercel/blob"
import {
  consumeStream,
  convertToModelMessages,
  createIdGenerator,
  stepCountIs,
  streamText,
  validateUIMessages,
  type UIMessage,
} from "ai"

import {
  CHAT_MODEL_ID,
  CONTEXT_BUDGET_MAX_CHARS,
  CONTEXT_BUDGET_RECENT_WINDOW_SIZE,
  MAX_OUTPUT_TOKENS,
} from "@/features/ai/chat/constants/chat-model.constants"
import { CHAT_SYSTEM_PROMPT } from "@/features/ai/chat/constants/chat-system-prompt"
import {
  generateAiChatTitleIfMissing,
  getChatWithMessages,
  replaceMessagesForChat,
  updateChatContextSummary,
} from "@/features/ai/chat/repositories/chat.repository"
import { chatRequestSchema } from "@/features/ai/chat/schemas/chat-request.schema"
import { buildAiContext } from "@/features/ai/chat/utils/build-ai-context.server"
import { buildBudgetedChatContext } from "@/features/ai/chat/utils/chat-context-budget.utils"
import { summarizeChatContext } from "@/features/ai/chat/utils/chat-context-summary.server"
import { getMaxInputTokensFromCostBudget } from "@/features/ai/chat/utils/chat-cost-budget.server"
import { chatTools } from "@/features/ai/chat/utils/chat-tools.server"
import { getSessionUserId } from "@/features/auth/lib/auth"

export const maxDuration = 300
const generateChatMessageId = createIdGenerator({
  prefix: "msg",
  size: 16,
})

function getAttachmentPathname(providerMetadata: unknown): string | null {
  if (!providerMetadata || typeof providerMetadata !== "object") {
    return null
  }

  const storage = (providerMetadata as { storage?: unknown }).storage
  if (!storage || typeof storage !== "object") {
    return null
  }

  const pathname = (storage as { pathname?: unknown }).pathname
  if (typeof pathname !== "string") {
    return null
  }

  const normalizedPathname = pathname.trim()
  return normalizedPathname ? normalizedPathname : null
}

async function toModelReadyMessages(messages: UIMessage[]): Promise<UIMessage[]> {
  return Promise.all(
    messages.map(async (message) => {
      const parts = await Promise.all(
        message.parts.map(async (part) => {
          if (part.type !== "file") {
            return part
          }

          const pathname = getAttachmentPathname(part.providerMetadata)
          if (!pathname) {
            return part
          }

          try {
            const blobResult = await get(pathname, {
              access: "private",
            })
            if (!blobResult?.blob) {
              return part
            }

            const contentType = blobResult.blob.contentType || part.mediaType || "application/octet-stream"
            const bytes = await new Response(blobResult.stream).arrayBuffer()
            return {
              ...part,
              mediaType: contentType,
              url: `data:${contentType};base64,${Buffer.from(bytes).toString("base64")}`,
            }
          } catch (error) {
            console.error("Failed to resolve private chat attachment for model input", {
              pathname,
              error,
            })
            return part
          }
        })
      )

      return {
        ...message,
        parts,
      }
    })
  )
}

export async function POST(req: Request) {
  const userId = await getSessionUserId()

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const parsed = chatRequestSchema.safeParse(await req.json())

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

  void generateAiChatTitleIfMissing({
    chatId,
    userId,
    chatTitle: chat.title,
    messages,
  }).catch(() => {
    // Title generation is best-effort and should not block chat streaming.
  })

  const result = streamText({
    model: CHAT_MODEL_ID,
    system: systemPrompt,
    messages: await convertToModelMessages(await toModelReadyMessages(budgetedContext.messagesForModel)),
    tools: chatTools,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    stopWhen: stepCountIs(5),
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendSources: true,
    generateMessageId: generateChatMessageId,
    consumeSseStream: consumeStream,
    onFinish: async ({ messages: finalMessages }) => {
      await replaceMessagesForChat(chatId, userId, finalMessages)
    },
  })
}
