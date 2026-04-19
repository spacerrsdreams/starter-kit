import type { UIMessage } from "ai"

export type ChatSessionUserMessageProps = {
  message: UIMessage
  canRetry: boolean
  timeLabel: string
  onCopy: () => Promise<void>
  onRetry: () => Promise<void>
}
