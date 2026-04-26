import "server-only"

import { NextResponse } from "next/server"

import { createChat } from "@/features/ai/chat/repositories/chat.repository"
import { getSessionUserId } from "@/features/auth/lib/auth"

export async function POST() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const created = await createChat(userId)

  return NextResponse.json(created)
}
