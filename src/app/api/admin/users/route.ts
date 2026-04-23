import "server-only"

import { NextResponse } from "next/server"

import { listAdminUsers } from "@/features/admin/repositories/admin-users.repository"
import { getAdminSession } from "@/features/admin/utils/get-admin-session.server"

const noIndexHeaders = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
}

export async function GET() {
  const session = await getAdminSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noIndexHeaders })
  }

  const result = await listAdminUsers()
  return NextResponse.json(result, { headers: noIndexHeaders })
}
