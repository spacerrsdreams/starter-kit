import type { MessageReaction } from "@/generated/prisma/browser"

export type ChatListItem = {
  id: string
  title: string | null
  isSaved: boolean
  updatedAt: string
}

export type ChatMessageReaction = MessageReaction

export type ChatAuthRequiredStore = {
  pendingPrompt: string | null
  setPendingPrompt: (prompt: string) => void
  clearPendingPrompt: () => void
}

export type ChatNavigationStore = {
  activeChatId: string | null
  setActiveChatId: (chatId: string | null) => void
}

export type ChatDraftStore = {
  draft: string
  setDraft: (draft: string) => void
  clearDraft: () => void
}

export type ChatCitationSource = {
  sourceId: string
  url: string
  title?: string
}

export type ChatToolInvocationPart = {
  type: `tool-${string}`
  toolCallId: string
  state?: "input-streaming" | "input-available" | "output-available" | "output-error" | string
  input?: unknown
  output?: unknown
  errorText?: string
}
