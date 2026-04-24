"use server"

import "server-only"

import { headers } from "next/headers"

import { auth } from "@/features/auth/lib/auth"
import { sendEmailVerificationRequest } from "@/features/settings/repositories/email-verification.repository"
import {
  sendEmailVerificationInputSchema,
  type SendEmailVerificationInput,
} from "@/features/settings/schemas/email-verification.schema"

type SendEmailVerificationActionResult =
  | { ok: true }
  | { ok: false; code: "UNAUTHORIZED" | "INVALID_INPUT" | "RATE_LIMITED" | "FAILED" }

export async function sendEmailVerificationAction(
  input: SendEmailVerificationInput
): Promise<SendEmailVerificationActionResult> {
  const parsed = sendEmailVerificationInputSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, code: "INVALID_INPUT" }
  }

  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session?.user?.id || !session.user.email) {
    return { ok: false, code: "UNAUTHORIZED" }
  }

  const cookieHeader = requestHeaders.get("cookie")

  if (!cookieHeader) {
    return { ok: false, code: "UNAUTHORIZED" }
  }

  const status = await sendEmailVerificationRequest({
    cookieHeader,
    callbackURL: parsed.data.callbackURL,
  })

  if (status === 200) {
    return { ok: true }
  }

  if (status === 429) {
    return { ok: false, code: "RATE_LIMITED" }
  }

  return { ok: false, code: "FAILED" }
}
