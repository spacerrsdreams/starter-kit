import type { UIMessage } from "ai"

export type ChatSessionProps = {
  sessionClientId: string
  isAuthenticated?: boolean
  initialMessages: UIMessage[]
  initialDbChatId: string | null
  examplePrompts?: readonly string[]
  examplePromptsLayout?: "default" | "single-column"
  compactMode?: boolean
  onChatCreated: (id: string) => void
  onConversationUpdated: () => void
}
