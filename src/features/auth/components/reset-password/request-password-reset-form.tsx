"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

import { WebRoutes } from "@/lib/web.routes"
import {
  ACCOUNT_DEACTIVATED,
  ACCOUNT_DEACTIVATED_RESET_PASSWORD_MESSAGE,
  UNKNOWN_ERROR_CODE,
} from "@/features/auth/constants"
import { requestPasswordResetAction } from "@/features/auth/lib/auth.actions"
import { requestPasswordResetSchema } from "@/features/auth/lib/auth.schema"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { LogoIcon } from "@/components/ui/icons/logo.icon"
import { Input } from "@/components/ui/input"

const texts = {
  resetPasswordTitle: "Reset password",
  requestResetDescription: "Enter your email to receive a password reset link.",
  emailSentDescription: "If an account exists, we sent you an email with reset instructions.",
  signInToReactivate: "Sign in to reactivate",
  email: "Email",
  emailPlaceholder: "example@gmail.com",
  sendResetEmail: "Send reset email",
  resetPasswordButton: "Send reset link",
  resendAria: "Resend reset email",
  resendEmail: "Resend email",
  rememberPassword: "Remember your password?",
  signIn: "Sign in",
}

export function RequestPasswordResetForm() {
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

  const isDeactivated = requestErrorCode === ACCOUNT_DEACTIVATED
  const requestErrorLabel = requestErrorCode ? getRequestPasswordResetErrorMessage(requestErrorCode) : null
  // eslint-disable-next-line no-nested-ternary
  const cardDescription = isDeactivated ? null : emailSent ? texts.emailSentDescription : texts.requestResetDescription

  return (
    <div className="space-y-5">
      <div className="space-y-1 text-center">
        <div className="mb-4 flex items-center justify-center">
          <LogoIcon iconSize={28} containerSize={38} />
        </div>
        <h1 className="text-2xl font-medium tracking-[-1px] text-foreground">{texts.resetPasswordTitle}</h1>
        {cardDescription ? <p className="text-sm text-muted-foreground">{cardDescription}</p> : null}
      </div>
      {isDeactivated ? (
        <div className="flex min-h-0 flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">{ACCOUNT_DEACTIVATED_RESET_PASSWORD_MESSAGE}</p>
          <Link
            href={WebRoutes.signIn.path}
            className="inline-flex font-medium text-primary underline underline-offset-2"
          >
            {texts.signInToReactivate}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-4">
            <div className="flex flex-col items-center gap-2 text-center text-sm">
              {requestErrorLabel && <p className="text-red-500">{requestErrorLabel}</p>}
            </div>
            {!emailSent && (
              <>
                <Field data-invalid={Boolean(form.formState.errors.email)}>
                  <FieldLabel htmlFor="email">{texts.email}</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder={texts.emailPlaceholder}
                    aria-invalid={Boolean(form.formState.errors.email)}
                    className="h-11 rounded-xl px-4"
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
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={isLoading}
                    aria-label={texts.sendResetEmail}
                    featureStylesEnabled
                    className="h-11 w-full rounded-full text-sm font-medium"
                  >
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
                  className="h-11 w-full rounded-full"
                >
                  {resendTimer > 0 ? `Resend in ${formatTime(resendTimer)}` : texts.resendEmail}
                </Button>
              </Field>
            )}
            <FieldDescription className="flex items-center justify-center gap-2 text-center text-sm">
              <span>{texts.rememberPassword}</span>
              <Link className="text-xs underline underline-offset-2" href={WebRoutes.signIn.path}>
                {texts.signIn}
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      )}
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
