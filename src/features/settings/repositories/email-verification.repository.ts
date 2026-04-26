import "server-only"

import { ApiRoutes } from "@/lib/api.routes"
import { ServerEnv } from "@/lib/env.server"

type SendEmailVerificationRepositoryInput = {
  cookieHeader: string
  callbackURL: string
}

export async function sendEmailVerificationRequest({
  cookieHeader,
  callbackURL,
}: SendEmailVerificationRepositoryInput): Promise<number> {
  const response = await fetch(
    `${ServerEnv.NEXT_PUBLIC_DOMAIN.replace(/\/$/, "")}${ApiRoutes.accountSendVerificationEmail}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        callbackURL,
      }),
      cache: "no-store",
    }
  )

  return response.status
}
