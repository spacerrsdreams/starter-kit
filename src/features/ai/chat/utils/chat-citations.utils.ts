import type { UIMessage } from "ai"

import type { ChatCitationSource } from "@/features/ai/chat/types/chat-citations.types"

export function getChatCitationSources(message: UIMessage): ChatCitationSource[] {
  const byKey = new Map<string, ChatCitationSource>()

  for (const part of message.parts) {
    if (part.type !== "source-url") {
      continue
    }

    const key = `${part.sourceId}:${part.url}`
    if (byKey.has(key)) {
      continue
    }

    byKey.set(key, {
      sourceId: part.sourceId,
      url: part.url,
      title: part.title,
    })
  }

  return Array.from(byKey.values())
}
