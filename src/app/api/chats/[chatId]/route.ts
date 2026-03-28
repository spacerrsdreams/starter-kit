import "server-only"

import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { deleteChat, getChatWithMessages } from "@/features/ai/chat/repositories/chat.repository"

type RouteContext = {
  params: Promise<{ chatId: string }>
}

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
