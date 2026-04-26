import type { UIMessage } from "ai"

export type BuildAiContextInput = {
  includeSystemInstructions?: boolean
  includeCompanyInstructions?: boolean
  includePolicyContext?: boolean
  includeAvailablePages?: boolean
  userRole?: "user" | "admin" | "moderator"
  currentPath?: string
  featureFlags?: string[]
  extraInstructions?: string[]
}

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

export type GenerateAiChatTitleIfMissingParams = {
  chatId: string
  userId: string
  chatTitle: string | null
  messages: UIMessage[]
}
