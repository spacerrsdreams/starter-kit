import "server-only"

import { Resend } from "resend"
import type { SendMailOptions } from "@/features/emails/types/emails.types"

export const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) return null

  return new Resend(apiKey)
}

export async function sendMail(options: SendMailOptions): Promise<void> {
  const resend = getResend()

  if (!resend) {
    const msg =
      "Email not sent: RESEND_API_KEY is not set. Add it to your .env file to enable password reset and other emails."

    console.error(msg)
    throw new Error(msg)
  }

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: options.to,
    subject: options.subject,
    react: options.react,
  })

  if (error) {
    throw new Error(error.message)
  }
}
