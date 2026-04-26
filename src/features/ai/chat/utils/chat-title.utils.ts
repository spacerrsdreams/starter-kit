import type { UIMessage } from "ai"

export function getFirstUserTextMessage(messages: UIMessage[]): string | null {
  const firstUserMessage = messages.find((message) => message.role === "user")
  if (!firstUserMessage) {
    return null
  }

  const firstTextPart = firstUserMessage.parts.find((part) => part.type === "text")
  if (!firstTextPart || firstTextPart.type !== "text") {
    return null
  }

  const trimmedText = firstTextPart.text.trim()
  return trimmedText.length > 0 ? trimmedText : null
}
