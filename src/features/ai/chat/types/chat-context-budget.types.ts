import type { UIMessage } from "ai"

export type ChatContextBudgetConfig = {
  maxContextChars: number
  maxInputTokens: number
  recentWindowSize: number
}

export type BudgetedChatContextResult = {
  messagesForModel: UIMessage[]
  summaryForModel: string | null
  shouldRefreshSummary: boolean
  messagesToSummarize: UIMessage[]
}
