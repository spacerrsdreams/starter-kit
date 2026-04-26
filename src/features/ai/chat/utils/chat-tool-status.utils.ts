import type { UIMessage } from "ai"

import type { ChatToolInvocationPart } from "@/features/ai/chat/types/chat.types"

function getToolName(part: ChatToolInvocationPart): string {
  return part.type.replace(/^tool-/, "")
}

function getToolLocation(input: unknown): string | null {
  if (!input || typeof input !== "object") {
    return null
  }

  if ("location" in input && typeof input.location === "string" && input.location.trim().length > 0) {
    return input.location.trim()
  }

  return null
}

export function getChatToolInvocationPart(part: UIMessage["parts"][number]): ChatToolInvocationPart | null {
  if (typeof part.type !== "string" || !part.type.startsWith("tool-")) {
    return null
  }

  if (!("toolCallId" in part) || typeof part.toolCallId !== "string") {
    return null
  }

  return part as ChatToolInvocationPart
}

export function getToolStatusLabel(part: ChatToolInvocationPart): string {
  const toolName = getToolName(part)
  const location = getToolLocation(part.input)
  const doneSuffix = part.state === "output-error" ? "failed" : "done"

  if (toolName === "weather") {
    if (isToolInvocationDone(part)) {
      return location ? `Weather check for ${location}: ${doneSuffix}` : `Weather check ${doneSuffix}`
    }
    return location ? `Checking the weather in ${location}...` : "Checking weather..."
  }
  if (toolName === "hikePlaner") {
    if (isToolInvocationDone(part)) {
      return location ? `Route check for ${location}: ${doneSuffix}` : `Route check ${doneSuffix}`
    }
    return location ? `Checking route in ${location}...` : "Checking hiking route..."
  }
  if (isToolInvocationDone(part)) {
    return `${toolName} ${doneSuffix}`
  }
  return `Running ${toolName}...`
}

export function isToolInvocationLoading(part: ChatToolInvocationPart): boolean {
  return part.state === "input-streaming" || part.state === "input-available" || !part.state
}

export function isToolInvocationDone(part: ChatToolInvocationPart): boolean {
  return part.state === "output-available" || part.state === "output-error"
}
