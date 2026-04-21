import "server-only"

import { z } from "zod"

import { sendMail } from "@/lib/resend/resend"
import { ContactSubmissionEmailTemplate } from "@/lib/resend/templates/contact-submission.template"
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

export const sendContactSubmissionEmailSchema = z.object({
  firstName: z.string().trim().min(1, "firstName is required"),
  lastName: z.string().trim().nullable(),
  email: z.email("email must be a valid email"),
  subject: z.string().trim().nullable(),
  message: z.string().trim().min(1, "message is required"),
})

type SendContactSubmissionEmailProps = z.infer<typeof sendContactSubmissionEmailSchema>

export async function sendContactSubmissionEmail(props: SendContactSubmissionEmailProps) {
  const parsed = sendContactSubmissionEmailSchema.safeParse(props)

  if (!parsed.success) {
    throw new Error(`Invalid sendContactSubmissionEmail props: ${parsed.error.message}`)
  }

  const supportEmail = process.env.SUPPORT_EMAIL
  if (!supportEmail) {
    throw new Error("SUPPORT_EMAIL is not configured. Please add SUPPORT_EMAIL to your .env file.")
  }

  const { firstName, lastName, email, subject, message } = parsed.data
  const submitterName = [firstName, lastName].filter(Boolean).join(" ").trim()
  const normalizedSubject = subject?.trim().length ? subject : "New contact form submission"

  await sendMail({
    to: supportEmail,
    subject: `[Contact] ${normalizedSubject}`,
    react: ContactSubmissionEmailTemplate({
      submitterName: submitterName || firstName,
      email,
      subject: normalizedSubject,
      message,
    }),
  })
}
