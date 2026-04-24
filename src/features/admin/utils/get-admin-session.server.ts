import "server-only"

import { headers } from "next/headers"

import { auth } from "@/features/auth/lib/auth"

export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user || session.user.role !== "admin") {
    return null
  }

  return session
}
