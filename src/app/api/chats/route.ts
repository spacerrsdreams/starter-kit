import "server-only"

import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { createChat, listChats } from "@/features/ai/chat/repositories/chat.repository"

async function getSessionUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function GET() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const rows = await listChats(userId)
  const chats = rows.map((chat) => ({
    id: chat.id,
    title: chat.title,
    updatedAt: chat.updatedAt.toISOString(),
  }))
  return NextResponse.json({ chats })
}

export async function POST() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const created = await createChat(userId)
  return NextResponse.json(created)
}
