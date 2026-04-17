export type ChatToolInvocationPart = {
  type: `tool-${string}`
  toolCallId: string
  state?: "input-streaming" | "input-available" | "output-available" | "output-error" | string
  input?: unknown
  output?: unknown
  errorText?: string
}

export type ChatSessionToolStatusProps = {
  part: ChatToolInvocationPart
}
