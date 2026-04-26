"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { Route } from "next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

import { WebRoutes } from "@/lib/web.routes"
import { mapResetPasswordError, UNKNOWN_ERROR_CODE } from "@/features/auth/constants"
import { resetPasswordTokenAction } from "@/features/auth/lib/auth.actions"
import { resetPasswordSchema } from "@/features/auth/lib/auth.schema"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { LogoIcon } from "@/components/ui/icons/logo.icon"
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
    <div className="space-y-5">
      <div className="space-y-1 text-center">
        <div className="mb-4 flex items-center justify-center">
          <LogoIcon iconSize={28} containerSize={38} />
        </div>
        <h1 className="text-2xl font-medium tracking-[-1px] text-foreground">{texts.resetPasswordTitle}</h1>
        <p className="text-sm text-muted-foreground">{texts.resetPasswordDescription}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <FieldGroup className="gap-4">
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
              className="h-11 rounded-xl px-4"
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
              className="h-11 rounded-xl px-4"
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
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              aria-label={texts.resetPassword}
              featureStylesEnabled
              className="h-11 w-full rounded-full text-sm font-medium"
            >
              {texts.resetPassword}
            </Button>
          </Field>
          <FieldDescription className="text-center">
            {texts.rememberPassword}{" "}
            <Link className="text-sm underline underline-offset-2" href={WebRoutes.signIn.path}>
              {texts.signIn}
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  )
}
