import "server-only"

import { createEmailVerificationToken } from "better-auth/api"
import { NextResponse } from "next/server"

import { sendEmailVerificationEmail } from "@/features/emails/lib/emails.actions"
import { checkVerificationEmailRatelimit } from "@/lib/ratelimit"
import { auth } from "@/features/auth/lib/auth"

const noIndexHeaders = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
  "Cache-Control": "no-store, no-cache, must-revalidate",
}

const VERIFICATION_TOKEN_EXPIRY_SEC = 3600

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noIndexHeaders })
  }

  if (session.user.emailVerified) {
    return NextResponse.json(
      { error: "EMAIL_ALREADY_VERIFIED", message: "Email is already verified" },
      { status: 400, headers: noIndexHeaders }
    )
  }

  const { success, retryAfterSeconds } = await checkVerificationEmailRatelimit(session.user.id)

  if (!success) {
    return NextResponse.json(
      {
        error: "rateLimited",
        message: "Too many verification emails sent. Please try again later.",
        retryAfter: retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          ...noIndexHeaders,
          "Retry-After": String(retryAfterSeconds),
        },
      }
    )
  }

  const secret = process.env.BETTER_AUTH_SECRET

  if (!secret) {
    return NextResponse.json(
      { error: "Server configuration error", code: "MISSING_BETTER_AUTH_SECRET" },
      { status: 500, headers: noIndexHeaders }
    )
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ??
    process.env.BETTER_AUTH_URL ??
    (() => {
      try {
        const url = new URL(req.url)
        return `${url.protocol}//${url.host}`
      } catch {
        return ""
      }
    })()

  if (!baseUrl) {
    return NextResponse.json(
      { error: "Server configuration error", code: "MISSING_BASE_URL" },
      { status: 500, headers: noIndexHeaders }
    )
  }

  const body = (await req.json().catch(() => ({}))) as { callbackURL?: string; locale?: string }
  const callbackURL =
    typeof body.callbackURL === "string" && body.callbackURL.length > 0
      ? body.callbackURL
      : `${baseUrl.replace(/\/$/, "")}/?emailVerified=1`

  try {
    const token = await createEmailVerificationToken(
      secret,
      session.user.email,
      undefined,
      VERIFICATION_TOKEN_EXPIRY_SEC
    )
    const encodedCallback = encodeURIComponent(callbackURL)
    const verifyUrl = `${baseUrl.replace(/\/$/, "")}/api/auth/verify-email?token=${token}&callbackURL=${encodedCallback}`

    await sendEmailVerificationEmail({
      to: session.user.email,
      subject: "Verify your email address",
      url: verifyUrl,
      firstName: session.user.name ?? "User",
    })

    return NextResponse.json({ status: true }, { headers: noIndexHeaders })
  } catch {
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500, headers: noIndexHeaders })
  }
}
