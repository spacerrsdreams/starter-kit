import "server-only"

import { headers } from "next/headers"

import { auth } from "@/lib/auth/auth"

export async function getAdminOrModeratorSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  const role = session?.user?.role

  if (!session?.user || (role !== "admin" && role !== "moderator")) {
    return null
  }

  return session
}
