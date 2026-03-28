import "server-only"

import { z } from "zod"

import { sendMail } from "@/lib/resend/resend"
import { EmailVerificationEmailTemplate } from "@/lib/resend/templates/email-verification.template"
import { ResetPasswordEmailTemplate } from "@/lib/resend/templates/reset-password.template"
import { WelcomeEmailTemplate } from "@/lib/resend/templates/welcome.template"
import { SiteConfig } from "@/lib/site.config"

export const sendResetPasswordEmailSchema = z.object({
  userFirstname: z.string().trim().min(1, "userFirstname is required"),
  to: z.email("to must be a valid email"),
  resetPasswordLink: z.url("resetPasswordLink must be a valid URL"),
})

type SendResetPasswordEmailProps = z.infer<typeof sendResetPasswordEmailSchema>

export async function sendResetPasswordEmail(props: SendResetPasswordEmailProps) {
  const parsed = sendResetPasswordEmailSchema.safeParse(props)

  if (!parsed.success) {
    throw new Error(`Invalid sendResetPasswordEmail props: ${parsed.error.message}`)
  }

  const { userFirstname, to, resetPasswordLink } = parsed.data

  await sendMail({
    to,
    subject: "Reset your password",
    react: ResetPasswordEmailTemplate({ userFirstname, resetPasswordLink }),
  })
}

export const sendWelcomeEmailSchema = z.object({
  to: z.email("to must be a valid email"),
  firstName: z.string().trim().min(1, "firstName is required"),
})

type SendWelcomeEmailProps = z.infer<typeof sendWelcomeEmailSchema>

export async function sendWelcomeEmail(props: SendWelcomeEmailProps) {
  const { to, firstName } = props

  await sendMail({
    to,
    subject: `Welcome to ${SiteConfig.name}`,
    react: WelcomeEmailTemplate({ firstName }),
  })
}

export const sendEmailVerificationEmailSchema = z.object({
  to: z.email("to must be a valid email"),
  subject: z.string().trim().min(1, "subject is required"),
  url: z.url("url must be a valid URL"),
  firstName: z.string().trim().min(1, "firstName is required"),
})

type SendEmailVerificationEmailProps = z.infer<typeof sendEmailVerificationEmailSchema>

export async function sendEmailVerificationEmail(props: SendEmailVerificationEmailProps) {
  const { to, subject, url, firstName } = props

  await sendMail({
    to,
    subject,
    react: EmailVerificationEmailTemplate({ firstName, url }),
  })
}
