import type { UIMessage } from "ai"

import type { ChatMessageReaction } from "@/features/ai/chat/types/chat.types"

function getMetadataRecord(message: UIMessage): Record<string, unknown> | null {
  const metadata = message.metadata
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return null
  }
  return metadata as Record<string, unknown>
}

export function getMessageReaction(message: UIMessage): ChatMessageReaction | null {
  const metadata = getMetadataRecord(message)
  const reaction = metadata?.reaction
  if (reaction === "like" || reaction === "unlike") {
    return reaction
  }
  return null
}

export function withMessageReaction(message: UIMessage, reaction: ChatMessageReaction | null): UIMessage {
  const metadata = getMetadataRecord(message) ?? {}
  if (!reaction) {
    const restMetadata = { ...metadata }
    delete restMetadata.reaction
    if (Object.keys(restMetadata).length === 0) {
      return {
        ...message,
        metadata: undefined,
      }
    }
    return {
      ...message,
      metadata: restMetadata,
    }
  }
  return {
    ...message,
    metadata: {
      ...metadata,
      reaction,
    },
  }
}
