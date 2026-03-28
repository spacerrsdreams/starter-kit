"use client"

import { updateNotificationPreferencesAction } from "@/actions/account/update-notification-preferences.action"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

import { ApiRoutes } from "@/lib/api.routes"
import { authClient } from "@/lib/auth/auth-client"
import { signInWithGoogleAction, signUpWithEmailAndPasswordAction } from "@/lib/auth/auth.actions"
import { signUpWithEmailAndPasswordSchema } from "@/lib/auth/auth.schema"
import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { UNKNOWN_ERROR_CODE } from "@/features/auth/constants"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { GoogleIcon } from "@/components/ui/icons/google.icon"
import { Input } from "@/components/ui/input"

interface SignUpFormProps {
  onSuccess: () => void
  onSwitchToSignIn: () => void
}

const texts = {
  signUp: "Sign up",
  signUpWithGoogle: "Sign up with Google",
  signIn: "Sign in",
  signUpTitle: "Sign up for {name}",
  signUpDescription: "Sign up to continue",
  or: "Or",
  email: "Email",
  emailPlaceholder: "Enter your email",
  password: "Password",
  passwordPlaceholder: "Create a password",
  confirmPassword: "Confirm password",
  confirmPasswordPlaceholder: "Re-enter your password",
  hidePassword: "Hide password",
  showPassword: "Show password",
  genericError: "An error occurred, please try again",
  userAlreadyExists: "An account with this email already exists",
  termsPrefix: "By continuing, you agree to our",
  termsSuffix: "and",
  termsOfService: "Terms of Service",
  privacyPolicy: "Privacy Policy",
  alreadyHaveAccount: "Already have an account?",
  personalizedEmails: "Personalized emails",
  personalizedEmailsDescription: "Receive product reminders and service updates.",
  marketingEmails: "Marketing emails",
  marketingEmailsDescription: "Receive promotions and feature announcements.",
}

export function SignUpForm({ onSuccess, onSwitchToSignIn }: SignUpFormProps) {
  const { refetch: refetchSession } = authClient.useSession()
  const [isLoading, startSubmitTransition] = useTransition()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [passwordVisible, setPasswordVisible] = useState(false)

  const form = useForm<z.infer<typeof signUpWithEmailAndPasswordSchema>>({
    resolver: zodResolver(signUpWithEmailAndPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      notificationsEmailMarketing: true,
      notificationsEmailPersonalized: true,
    },
  })

  const clearErrorCode = () => {
    if (errorCode) setErrorCode(null)
  }

  const handleSubmit = form.handleSubmit((values) => {
    setErrorCode(null)
    startSubmitTransition(async () => {
      const result = await signUpWithEmailAndPasswordAction({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        notificationsEmailMarketing: values.notificationsEmailMarketing,
        notificationsEmailPersonalized: values.notificationsEmailPersonalized,
        embedded: true,
      })
      if (result.ok) {
        await refetchSession()
        await updateNotificationPreferencesAction({
          notificationsEmailMarketing: values.notificationsEmailMarketing,
          notificationsEmailPersonalized: values.notificationsEmailPersonalized,
        })
        onSuccess()
        return
      }
      setErrorCode(result.code ?? UNKNOWN_ERROR_CODE)
    })
  })

  const handleSignUpWithGoogle = () => {
    setGoogleLoading(true)
    startSubmitTransition(async () => {
      try {
        await signInWithGoogleAction(ApiRoutes.authSignedIn)
      } catch {
        /* OAuth redirect */
      } finally {
        setGoogleLoading(false)
      }
    })
  }

  const errorMessage =
    errorCode === "USER_ALREADY_EXISTS" ? texts.userAlreadyExists : errorCode ? texts.genericError : null
  const emailValue = form.watch("email")
  const isSubmitDisabled = isLoading || googleLoading

  const formBody = (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-2.5">
        {errorMessage && <p className="text-center text-sm text-red-500">{errorMessage}</p>}
        <Field className="flex flex-col gap-2">
          <Button
            variant="outline"
            type="button"
            isLoading={googleLoading}
            disabled={isSubmitDisabled}
            onClick={handleSignUpWithGoogle}
            aria-label={texts.signUpWithGoogle}
          >
            <GoogleIcon />
            <span>{texts.signUpWithGoogle}</span>
          </Button>
        </Field>
        <FieldSeparator className="my-1">{texts.or}</FieldSeparator>
        <Field data-invalid={Boolean(form.formState.errors.email)}>
          <FieldLabel htmlFor="email">{texts.email}</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={texts.emailPlaceholder}
            required
            {...form.register("email", { onChange: clearErrorCode })}
          />
          {form.formState.errors.email?.message && (
            <FieldError errors={[{ message: form.formState.errors.email.message }]} />
          )}
        </Field>
        <Input
          type="text"
          name="username"
          autoComplete="username"
          value={emailValue ?? ""}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          readOnly
        />
        <Field data-invalid={Boolean(form.formState.errors.password)}>
          <FieldLabel htmlFor="password">{texts.password}</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={passwordVisible ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder={texts.passwordPlaceholder}
              className="pr-10"
              {...form.register("password", { onChange: clearErrorCode })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-full rounded-l-none rounded-r-xl px-3"
              onClick={() => setPasswordVisible((v) => !v)}
              aria-label={passwordVisible ? texts.hidePassword : texts.showPassword}
              tabIndex={-1}
            >
              {passwordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
          {form.formState.errors.password?.message && (
            <FieldError errors={[{ message: form.formState.errors.password.message }]} />
          )}
        </Field>
        <Field data-invalid={Boolean(form.formState.errors.confirmPassword)}>
          <FieldLabel htmlFor="confirmPassword">{texts.confirmPassword}</FieldLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={passwordVisible ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder={texts.confirmPasswordPlaceholder}
              className="pr-10"
              {...form.register("confirmPassword", { onChange: clearErrorCode })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-full rounded-l-none rounded-r-xl px-3"
              onClick={() => setPasswordVisible((v) => !v)}
              aria-label={passwordVisible ? texts.hidePassword : texts.showPassword}
              tabIndex={-1}
            >
              {passwordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
          {form.formState.errors.confirmPassword?.message && (
            <FieldError errors={[{ message: form.formState.errors.confirmPassword.message }]} />
          )}
        </Field>
        <Field className="mt-1 rounded-xl border p-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="notificationsEmailPersonalized"
              checked={form.watch("notificationsEmailPersonalized")}
              onCheckedChange={(checked) => form.setValue("notificationsEmailPersonalized", checked === true)}
            />
            <FieldDescription className="text-xs">{texts.personalizedEmailsDescription}</FieldDescription>
          </div>
        </Field>
        <Field className="rounded-xl border p-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="notificationsEmailMarketing"
              checked={form.watch("notificationsEmailMarketing")}
              onCheckedChange={(checked) => form.setValue("notificationsEmailMarketing", checked === true)}
            />
            <FieldDescription className="text-xs">{texts.marketingEmailsDescription}</FieldDescription>
          </div>
        </Field>
        <Field>
          <Button
            className="font-bold"
            type="submit"
            isLoading={isLoading}
            disabled={isSubmitDisabled}
            aria-label={texts.signUp}
          >
            {texts.signUp}
          </Button>
        </Field>
        <FieldDescription className="px-4 text-center text-xs">
          {texts.termsPrefix}{" "}
          <Link href={WebRoutes.termsOfService.path} className="underline underline-offset-2 hover:text-foreground">
            {texts.termsOfService}
          </Link>{" "}
          {texts.termsSuffix}{" "}
          <Link href={WebRoutes.privacyPolicy.path} className="underline underline-offset-2 hover:text-foreground">
            {texts.privacyPolicy}
          </Link>
          .
        </FieldDescription>
        <FieldDescription className="flex items-center justify-center gap-1 pt-2 text-center text-xs">
          <span className="text-muted-foreground">{texts.alreadyHaveAccount}</span>
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="cursor-pointer text-primary underline underline-offset-2"
          >
            {texts.signIn}
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  )

  return (
    <div className="space-y-3">
      <DialogHeader>
        <DialogTitle className="text-center">{texts.signUpTitle.replace("{name}", SiteConfig.name)}</DialogTitle>
        <DialogDescription className="text-center"> {texts.signUpDescription}</DialogDescription>
      </DialogHeader>
      <div>{formBody}</div>
    </div>
  )
}
