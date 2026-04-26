import "server-only"

import { NextResponse } from "next/server"

import { ServerEnv } from "@/lib/env.server"
import { WebRoutes } from "@/lib/web.routes"
import { parseSafePostAuthRedirectUrl } from "@/features/auth/auth.utils"
import { getSessionUserId } from "@/features/auth/lib/auth"

export async function GET(request: Request) {
  const userId = await getSessionUserId()

  const nextParam = new URL(request.url).searchParams.get("next")

  if (!userId) {
    return NextResponse.redirect(new URL(WebRoutes.root.path, ServerEnv.NEXT_PUBLIC_DOMAIN))
  }

  const safeNext = parseSafePostAuthRedirectUrl(nextParam, ServerEnv.NEXT_PUBLIC_DOMAIN)
  const redirectUrl = safeNext ?? new URL(WebRoutes.root.path, ServerEnv.NEXT_PUBLIC_DOMAIN)

  return NextResponse.redirect(redirectUrl)
}
