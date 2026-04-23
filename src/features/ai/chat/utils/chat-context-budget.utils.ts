import type { UIMessage } from "ai"

import type {
  BudgetedChatContextResult,
  ChatContextBudgetConfig,
} from "@/features/ai/chat/types/chat-context-budget.types"

function getMessageText(message: UIMessage): string {
  const role = message.role.toUpperCase()
  const partsText = message.parts
    .map((part) => {
      switch (part.type) {
        case "text":
          return part.text
        case "file":
          return `[FILE:${part.filename ?? part.mediaType ?? "attachment"}]`
        default:
          return ""
      }
    })
    .filter(Boolean)
    .join("\n")

  return `${role}: ${partsText}`
}

function getMessagesCharSize(messages: UIMessage[]): number {
  return messages.reduce((total, message) => total + getMessageText(message).length, 0)
}

function estimateTokensFromChars(chars: number): number {
  return Math.ceil(chars / 4)
}

function createSummaryMessage(summary: string): UIMessage {
  return {
    id: "chat-context-summary",
    role: "system",
    parts: [{ type: "text", text: `Conversation summary so far:\n${summary}` }],
  }
}

export function buildBudgetedChatContext(
  messages: UIMessage[],
  contextSummary: string | null,
  config: ChatContextBudgetConfig
): BudgetedChatContextResult {
  if (messages.length <= config.recentWindowSize) {
    const summaryMessage = contextSummary?.trim() ? [createSummaryMessage(contextSummary.trim())] : []
    const messagesForModel = [...summaryMessage, ...messages]

    return {
      messagesForModel,
      summaryForModel: contextSummary?.trim() ?? null,
      shouldRefreshSummary: false,
      messagesToSummarize: [],
    }
  }

  const recentMessages = messages.slice(-config.recentWindowSize)
  const olderMessages = messages.slice(0, -config.recentWindowSize)
  const summaryMessage = contextSummary?.trim() ? [createSummaryMessage(contextSummary.trim())] : []
  let summaryForModel = contextSummary?.trim() ?? null
  let shouldRefreshSummary = olderMessages.length > 0
  let messagesForModel = [...summaryMessage, ...recentMessages]

  while (messagesForModel.length > 1) {
    const chars = getMessagesCharSize(messagesForModel)
    const tokens = estimateTokensFromChars(chars)
    const isWithinBudget = chars <= config.maxContextChars && tokens <= config.maxInputTokens
    if (isWithinBudget) {
      break
    }

    // Drop oldest non-summary message until we fit the budget.
    const dropIndex = summaryForModel ? 1 : 0
    messagesForModel = messagesForModel.filter((_, index) => index !== dropIndex)
  }

  if (messagesForModel.length === 0) {
    messagesForModel = summaryForModel ? [createSummaryMessage(summaryForModel)] : []
  }

  // If summary exists but no older messages remain, summary can be reset.
  if (olderMessages.length === 0 && summaryForModel) {
    summaryForModel = null
    shouldRefreshSummary = false
  }

  return {
    messagesForModel,
    summaryForModel,
    shouldRefreshSummary,
    messagesToSummarize: olderMessages,
  }
}

export function buildSummaryTranscript(messages: UIMessage[]): string {
  return messages.map(getMessageText).join("\n\n")
}
