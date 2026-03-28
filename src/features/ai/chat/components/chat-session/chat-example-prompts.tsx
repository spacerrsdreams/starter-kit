"use client"

import { cn } from "@/lib/utils"
import { CHAT_EXAMPLE_PROMPTS } from "@/features/ai/chat/constants/chat-example-prompts.constants"
import type { ChatExamplePromptsProps } from "@/features/ai/chat/types/chat-example-prompts.types"
import { Button } from "@/components/ui/button"

export function ChatExamplePrompts({
  disabled = false,
  prompts = CHAT_EXAMPLE_PROMPTS,
  layout = "default",
  onSelect,
}: ChatExamplePromptsProps) {
  const isSingleColumn = layout === "single-column"

  return (
    <div className={cn("mb-3 grid gap-2", isSingleColumn ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
      {prompts.map((prompt, index) => (
        <Button
          key={prompt}
          variant="outline"
          type="button"
          disabled={disabled}
          className={cn(
            "h-auto min-h-10 justify-start px-3 py-2 text-left text-xs font-normal whitespace-normal text-muted-foreground hover:text-foreground",
            !isSingleColumn && index > 1 ? "hidden sm:flex" : undefined
          )}
          onClick={() => {
            onSelect(prompt)
          }}
        >
          {prompt}
        </Button>
      ))}
    </div>
  )
}
