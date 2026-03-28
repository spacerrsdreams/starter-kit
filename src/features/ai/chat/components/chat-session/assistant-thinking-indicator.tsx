"use client"

import { Shimmer } from "@/components/ai-elements/shimmer"

export function AssistantThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Shimmer className="text-sm text-muted-foreground">Thinking...</Shimmer>
    </div>
  )
}
