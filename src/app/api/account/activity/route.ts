import "server-only"

import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { getSessionUserId } from "@/features/auth/lib/auth"

const noIndexHeaders = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
}

export async function POST() {
  const userId = await getSessionUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noIndexHeaders })
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lastActiveAt: new Date(),
    },
  })

  return NextResponse.json({ ok: true }, { headers: noIndexHeaders })
}
