import "server-only"

import { NextResponse } from "next/server"

import { getSharedChatWithMessages } from "@/features/ai/chat/repositories/chat.repository"

type RouteContext = {
  params: Promise<{ shareId: string }>
}

export async function GET(_req: Request, context: RouteContext) {
  const { shareId } = await context.params
  const chat = await getSharedChatWithMessages(shareId)
  if (!chat) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 })
  }
  return NextResponse.json(chat)
}
