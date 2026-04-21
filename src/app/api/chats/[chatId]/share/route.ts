import "server-only"

import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { ensureChatShareId } from "@/features/ai/chat/repositories/chat.repository"

type RouteContext = {
  params: Promise<{ chatId: string }>
}

async function getSessionUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function POST(_req: Request, context: RouteContext) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { chatId } = await context.params
  const shareId = await ensureChatShareId(chatId, userId)
  if (!shareId) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 })
  }
  return NextResponse.json({ shareId })
}
