import "server-only"

import { TITLE_MODEL, gateway } from "@/lib/ai"
import { generateText } from "ai"

export async function generateChatTitleFromUserMessage(input: string): Promise<string> {
  const prompt = `Generate a short chat title (max 6 words) for this user message:\n\n${input}`
  const { text } = await generateText({
    model: gateway(TITLE_MODEL),
    prompt,
  })
  const cleaned = text.trim().replace(/^["']|["']$/g, "")
  return cleaned.slice(0, 80) || "Untitled chat"
}
