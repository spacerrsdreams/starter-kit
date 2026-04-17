import type { UIMessage } from "ai"

export type ChatCitationSource = {
  sourceId: string
  url: string
  title?: string
}

export type ChatSessionCitationsProps = {
  sources: ChatCitationSource[]
}

export type ChatSessionAssistantMessageProps = {
  message: UIMessage
  isAnimating: boolean
}
