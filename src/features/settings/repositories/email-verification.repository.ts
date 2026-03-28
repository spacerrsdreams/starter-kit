import "server-only"

import { ApiRoutes } from "@/lib/api.routes"

type SendEmailVerificationRepositoryInput = {
  cookieHeader: string
  callbackURL: string
}

export async function sendEmailVerificationRequest({
  cookieHeader,
  callbackURL,
}: SendEmailVerificationRepositoryInput): Promise<number> {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN

  if (!baseUrl) {
    return 500
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${ApiRoutes.accountSendVerificationEmail}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify({
      callbackURL,
    }),
    cache: "no-store",
  })

  return response.status
}
