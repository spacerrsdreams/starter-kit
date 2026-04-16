import "server-only"

import { generateText } from "ai"

import { TITLE_MODEL } from "@/lib/ai"

export async function generateChatTitleFromUserMessage(input: string): Promise<string> {
  const prompt = `Generate a short chat title (max 6 words) for this user message:\n\n${input}`
  const { text } = await generateText({
    model: TITLE_MODEL,
    prompt,
  })
  const cleaned = text.trim().replace(/^["']|["']$/g, "")
  return cleaned.slice(0, 80) || "Untitled chat"
}
