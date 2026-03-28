"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { Route } from "next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

import { resetPasswordTokenAction } from "@/lib/auth/auth.actions"
import { resetPasswordSchema } from "@/lib/auth/auth.schema"
import { WebRoutes } from "@/lib/web.routes"
import { mapResetPasswordError, UNKNOWN_ERROR_CODE } from "@/features/auth/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface ResetPasswordFormProps {
  token: string
  initialError: string | null
}

const texts = {
  resetPasswordTitle: "Reset password",
  resetPasswordDescription: "Choose a new password for your account.",
  newPassword: "New password",
  newPasswordPlaceholder: "Enter your new password",
  confirmPassword: "Confirm password",
  confirmPasswordPlaceholder: "Re-enter your new password",
  resetPassword: "Reset password",
  rememberPassword: "Remember your password?",
  signIn: "Sign in",
}

export function ResetPasswordForm({ token, initialError }: ResetPasswordFormProps) {
  const router = useRouter()
  const [isLoading, startTransition] = useTransition()
  const [resetErrorCode, setResetErrorCode] = useState<string | null>(initialError ?? null)

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      setResetErrorCode(null)
      const result = await resetPasswordTokenAction({
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
        token,
      })

      if (result.ok) {
        if ("redirectTo" in result && result.redirectTo) {
          router.push(result.redirectTo as Route)
        }
        return
      }

      setResetErrorCode(result.code ?? UNKNOWN_ERROR_CODE)
    })
  })

  const resetErrorLabel = resetErrorCode ? mapResetPasswordError(resetErrorCode) : null

  return (
    <Card className="flex h-screen min-h-0 w-full max-w-full min-w-full flex-col justify-center gap-2 rounded-none border-0 shadow-none sm:justify-start sm:rounded-xl sm:border md:h-auto md:max-w-md md:min-w-0 md:flex-initial">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{texts.resetPasswordTitle}</CardTitle>
        <CardDescription>{texts.resetPasswordDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div>{resetErrorLabel && <p className="text-red-500">{resetErrorLabel}</p>}</div>
            <Field data-invalid={Boolean(form.formState.errors.newPassword)}>
              <FieldLabel htmlFor="newPassword">{texts.newPassword}</FieldLabel>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder={texts.newPasswordPlaceholder}
                aria-invalid={Boolean(form.formState.errors.newPassword)}
                {...form.register("newPassword", {
                  onChange: () => {
                    if (resetErrorCode) setResetErrorCode(null)
                  },
                })}
              />
              {form.formState.errors.newPassword?.message && (
                <FieldError errors={[{ message: form.formState.errors.newPassword.message }]} />
              )}
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.confirmPassword)}>
              <FieldLabel htmlFor="confirmPassword">{texts.confirmPassword}</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder={texts.confirmPasswordPlaceholder}
                aria-invalid={Boolean(form.formState.errors.confirmPassword)}
                {...form.register("confirmPassword", {
                  onChange: () => {
                    if (resetErrorCode) setResetErrorCode(null)
                  },
                })}
              />
              {form.formState.errors.confirmPassword?.message && (
                <FieldError errors={[{ message: form.formState.errors.confirmPassword.message }]} />
              )}
            </Field>
            <Field>
              <Button type="submit" isLoading={isLoading} disabled={isLoading} aria-label={texts.resetPassword}>
                {texts.resetPassword}
              </Button>
            </Field>
            <FieldDescription className="text-center">
              {texts.rememberPassword}{" "}
              <Link className="text-sm underline" href={WebRoutes.signIn.path}>
                {texts.signIn}
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
