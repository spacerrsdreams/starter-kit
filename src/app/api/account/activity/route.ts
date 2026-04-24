import "server-only"

import { NextResponse } from "next/server"

import { auth } from "@/features/auth/lib/auth"
import { prisma } from "@/lib/prisma"

const noIndexHeaders = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noIndexHeaders })
  }

  await prisma.session.updateMany({
    where: {
      userId: session.user.id,
    },
    data: {
      updatedAt: new Date(),
    },
  })

  return NextResponse.json({ ok: true }, { headers: noIndexHeaders })
}
