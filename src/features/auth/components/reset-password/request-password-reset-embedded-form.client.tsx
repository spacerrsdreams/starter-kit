"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

import { requestPasswordResetAction } from "@/lib/auth/auth.actions"
import { requestPasswordResetSchema } from "@/lib/auth/auth.schema"
import {
  ACCOUNT_DEACTIVATED,
  ACCOUNT_DEACTIVATED_RESET_PASSWORD_MESSAGE,
  UNKNOWN_ERROR_CODE,
} from "@/features/auth/constants"
import { Button } from "@/components/ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type RequestPasswordResetEmbeddedFormProps = {
  onBackToSignIn: () => void
}

const texts = {
  resetPasswordTitle: "Reset password",
  requestResetDescription: "Enter your email to receive a password reset link.",
  emailSentDescription: "If an account exists, we sent you an email with reset instructions.",
  email: "Email",
  emailPlaceholder: "example@gmail.com",
  sendResetEmail: "Send reset email",
  resetPasswordButton: "Send reset link",
  resendAria: "Resend reset email",
  resendEmail: "Resend email",
  rememberPassword: "Remember your password?",
  signIn: "Sign in",
}

export function RequestPasswordResetEmbeddedForm({ onBackToSignIn }: RequestPasswordResetEmbeddedFormProps) {
  const [isLoading, startTransition] = useTransition()
  const [requestErrorCode, setRequestErrorCode] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [resendLoading, setResendLoading] = useState(false)

  const form = useForm<z.infer<typeof requestPasswordResetSchema>>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { email: "" },
  })

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      setRequestErrorCode(null)
      const result = await requestPasswordResetAction({
        email: values.email,
      })

      if (result?.ok) {
        setEmailSent(true)
        setResendTimer(60)
      } else if (result && result.ok === false) {
        setRequestErrorCode(result.code ?? UNKNOWN_ERROR_CODE)
      }
    })
  })

  useEffect(() => {
    if (!emailSent || resendTimer <= 0) return

    const timer = setTimeout(() => {
      setResendTimer((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [emailSent, resendTimer])

  const handleResend = async () => {
    if (resendTimer > 0 || resendLoading) return

    setResendLoading(true)
    try {
      const result = await requestPasswordResetAction({
        email: form.getValues("email"),
      })

      if (result?.ok) {
        setResendTimer(60)
      } else if (result && result.ok === false) {
        setRequestErrorCode(result.code ?? UNKNOWN_ERROR_CODE)
      }
    } finally {
      setResendLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const requestErrorLabel = requestErrorCode ? getRequestPasswordResetErrorMessage(requestErrorCode) : null

  return (
    <div className="space-y-3">
      <DialogHeader>
        <DialogTitle className="text-center">{texts.resetPasswordTitle}</DialogTitle>
        <DialogDescription className="text-center">
          {emailSent ? texts.emailSentDescription : texts.requestResetDescription}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <FieldGroup className="gap-4">
          <div className="flex flex-col items-center gap-2 text-center text-sm">
            {requestErrorLabel && <p className="text-red-500">{requestErrorLabel}</p>}
          </div>

          {!emailSent && (
            <>
              <Field data-invalid={Boolean(form.formState.errors.email)}>
                <FieldLabel htmlFor="reset-email" className="ml-0.5">
                  {texts.email}
                </FieldLabel>
                <Input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder={texts.emailPlaceholder}
                  aria-invalid={Boolean(form.formState.errors.email)}
                  {...form.register("email", {
                    onChange: () => {
                      if (requestErrorCode) setRequestErrorCode(null)
                    },
                  })}
                />
                {form.formState.errors.email?.message && (
                  <FieldError errors={[{ message: form.formState.errors.email.message }]} />
                )}
              </Field>
              <Field>
                <Button type="submit" isLoading={isLoading} disabled={isLoading} aria-label={texts.sendResetEmail}>
                  {texts.resetPasswordButton}
                </Button>
              </Field>
            </>
          )}

          {emailSent && (
            <Field>
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleResend()}
                isLoading={resendLoading}
                disabled={resendTimer > 0 || resendLoading}
                aria-label={resendTimer > 0 ? `${texts.resendAria} in ${formatTime(resendTimer)}` : texts.resendAria}
              >
                {resendTimer > 0 ? `Resend in ${formatTime(resendTimer)}` : texts.resendEmail}
              </Button>
            </Field>
          )}

          <FieldDescription className="flex items-center justify-center gap-1 pt-2 text-center text-xs">
            <span className="text-muted-foreground">{texts.rememberPassword}</span>
            <button
              type="button"
              onClick={onBackToSignIn}
              className="cursor-pointer text-primary underline underline-offset-2"
            >
              {texts.signIn}
            </button>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  )
}

function getRequestPasswordResetErrorMessage(code: string): string {
  switch (code) {
    case ACCOUNT_DEACTIVATED:
      return ACCOUNT_DEACTIVATED_RESET_PASSWORD_MESSAGE
    case "INVALID_EMAIL":
      return "Invalid email address."
    default:
      return "An error occurred, please try again."
  }
}
