import "server-only"

import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { createChat, listChats } from "@/features/ai/chat/repositories/chat.repository"
import { auth } from "@/features/auth/lib/auth"

const DEFAULT_LIMIT = 15
const MAX_LIMIT = 30

async function getSessionUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function GET(req: Request) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const parsedLimit = Number(searchParams.get("limit"))
  const parsedOffset = Number(searchParams.get("offset"))
  const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(MAX_LIMIT, Math.floor(parsedLimit))) : DEFAULT_LIMIT
  const offset = Number.isFinite(parsedOffset) ? Math.max(0, Math.floor(parsedOffset)) : 0
  const rows = await listChats(userId, limit, offset)
  const chats = rows.map((chat) => ({
    id: chat.id,
    title: chat.title,
    isSaved: chat.isSaved,
    updatedAt: chat.updatedAt.toISOString(),
  }))
  const nextOffset = rows.length < limit ? null : offset + rows.length
  return NextResponse.json({ chats, nextOffset })
}

export async function POST() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const created = await createChat(userId)
  return NextResponse.json(created)
}
