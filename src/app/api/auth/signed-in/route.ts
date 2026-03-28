import "server-only"

import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { WebRoutes } from "@/lib/web.routes"
import { parseSafePostAuthRedirectUrl } from "@/features/auth/auth.utils"

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN!
  const nextParam = new URL(request.url).searchParams.get("next")

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL(WebRoutes.root.path, baseUrl))
  }

  const safeNext = parseSafePostAuthRedirectUrl(nextParam, baseUrl)
  const redirectUrl = safeNext ?? new URL(WebRoutes.root.path, baseUrl)

  return NextResponse.redirect(redirectUrl)
}
