import "server-only"

import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/lib/auth/auth"
import { deleteChat, getChatWithMessages, updateChatMetadata } from "@/features/ai/chat/repositories/chat.repository"

type RouteContext = {
  params: Promise<{ chatId: string }>
}

const updateChatSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    isSaved: z.boolean().optional(),
  })
  .refine((data) => data.title !== undefined || data.isSaved !== undefined, {
    message: "Nothing to update",
  })

async function getSessionUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function GET(_req: Request, context: RouteContext) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { chatId } = await context.params
  const data = await getChatWithMessages(chatId, userId)
  if (!data) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 })
  }
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, context: RouteContext) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { chatId } = await context.params
  const deleted = await deleteChat(chatId, userId)
  if (!deleted) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 })
  }
  return new NextResponse(null, { status: 204 })
}

export async function PATCH(req: Request, context: RouteContext) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const parseResult = updateChatSchema.safeParse(await req.json())
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
  const { chatId } = await context.params
  const updated = await updateChatMetadata(chatId, userId, parseResult.data)
  if (!updated) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 })
  }
  return new NextResponse(null, { status: 204 })
}
