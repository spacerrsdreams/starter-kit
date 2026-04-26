import "server-only"

import { NextResponse } from "next/server"

import { WebRoutes } from "@/lib/web.routes"
import { parseSafePostAuthRedirectUrl } from "@/features/auth/auth.utils"
import { getSessionUserId } from "@/features/auth/lib/auth"

const baseUrl = process.env.NEXT_PUBLIC_DOMAIN!

export async function GET(request: Request) {
  const userId = await getSessionUserId()

  const nextParam = new URL(request.url).searchParams.get("next")

  if (!userId) {
    return NextResponse.redirect(new URL(WebRoutes.root.path, baseUrl))
  }

  const safeNext = parseSafePostAuthRedirectUrl(nextParam, baseUrl)
  const redirectUrl = safeNext ?? new URL(WebRoutes.root.path, baseUrl)

  return NextResponse.redirect(redirectUrl)
}
