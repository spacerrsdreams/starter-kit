import "server-only"

import { generateText, type UIMessage } from "ai"

import { CHAT_MODEL_ID } from "@/features/ai/chat/constants/chat-model.constants"
import { buildSummaryTranscript } from "@/features/ai/chat/utils/chat-context-budget.utils"

export async function summarizeChatContext(
  existingSummary: string | null,
  messagesToSummarize: UIMessage[]
): Promise<string> {
  const transcript = buildSummaryTranscript(messagesToSummarize)
  const summaryPrompt = `You are maintaining rolling chat memory.

Current summary:
${existingSummary?.trim() || "(none)"}

New transcript chunk:
${transcript}

Return an updated, compact summary that preserves:
- user preferences and constraints
- key facts and decisions
- unresolved tasks
- important tool outcomes

Use bullet points. Keep it under 1200 characters.`

  const { text } = await generateText({
    model: CHAT_MODEL_ID,
    prompt: summaryPrompt,
    temperature: 0.2,
  })

  return text.trim().slice(0, 1200)
}
