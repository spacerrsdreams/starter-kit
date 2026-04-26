import "server-only"

import { NextResponse } from "next/server"
import { z } from "zod"

import { updateMessageReaction } from "@/features/ai/chat/repositories/chat.repository"
import { getSessionUserId } from "@/features/auth/lib/auth"

type RouteContext = {
  params: Promise<{ chatId: string; messageId: string }>
}

const requestSchema = z
  .object({
    reaction: z.enum(["like", "unlike"]).nullable(),
    feedbackText: z.string().trim().max(500).nullable().optional(),
  })
  .refine((data) => data.reaction !== "unlike" || Boolean(data.feedbackText?.trim()), {
    message: "Feedback text is required for unlike reaction",
  })

export async function PATCH(req: Request, context: RouteContext) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const parseResult = requestSchema.safeParse(await req.json())
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const { chatId, messageId } = await context.params
  const feedbackText = parseResult.data.reaction === "unlike" ? (parseResult.data.feedbackText?.trim() ?? null) : null
  const updated = await updateMessageReaction(chatId, userId, messageId, parseResult.data.reaction, feedbackText)

  if (!updated) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 })
  }

  return new NextResponse(null, { status: 204 })
}
