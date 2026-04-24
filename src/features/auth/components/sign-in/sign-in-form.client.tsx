"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

import { SiteConfig } from "@/lib/site.config"
import { buildPostAuthCallbackUrl } from "@/features/auth/components/sign-in/sign-in-callback.utils"
import { getSignInErrorMessageKey } from "@/features/auth/components/sign-in/sign-in-form.utils"
import { SignInReactivateDialog } from "@/features/auth/components/sign-in/sign-in-reactivate-dialog.client"
import { ACCOUNT_DEACTIVATED, UNKNOWN_ERROR_CODE } from "@/features/auth/constants"
import { authClient } from "@/features/auth/lib/auth-client"
import {
  reactivateAndSignInAction,
  signInWithEmailAndPasswordAction,
  signInWithGoogleAction,
} from "@/features/auth/lib/auth.actions"
import { signInWithEmailAndPasswordSchema } from "@/features/auth/lib/auth.schema"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { GoogleIcon } from "@/components/ui/icons/google.icon"
import { LogoIcon } from "@/components/ui/icons/logo.icon"
import { Input } from "@/components/ui/input"

interface SignInFormProps {
  onSuccess: () => void
  onSwitchToSignUp: () => void
  onForgotPassword: () => void
  callbackURL?: string
}

const texts = {
  signIn: "Sign in",
  signInWithGoogle: "Sign in with Google",
  signInWithApple: "Sign in with Apple",
  orContinueWith: "Or continue with",
  email: "Email",
  emailPlaceholder: "example@gmail.com",
  password: "Password",
  forgotPassword: "Forgot password",
  noAccountSignUp: "Don't have an account? ",
  signUp: "Sign up",
  signInTitle: "Sign in to {name}",
  signInDescription: "Sign in to your account to continue",
  emailNotVerified: "Email not verified",
  emailNotVerifiedHint: "Please verify your email to sign in",
  errorGeneric: "An error occurred, please try again",
  hidePassword: "Hide password",
  showPassword: "Show password",
}

export function SignInForm({ onSuccess, onSwitchToSignUp, onForgotPassword, callbackURL }: SignInFormProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { refetch: refetchSession } = authClient.useSession()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [reactivateOpen, setReactivateOpen] = useState(false)
  const [reactivateError, setReactivateError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isReactivatePending, startReactivateTransition] = useTransition()

  const buildCallbackUrl = (): string =>
    callbackURL ??
    buildPostAuthCallbackUrl({
      embedded: true,
      pathname,
      searchParams,
      serverSafeNext: undefined,
    })

  const form = useForm<z.infer<typeof signInWithEmailAndPasswordSchema>>({
    resolver: zodResolver(signInWithEmailAndPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    setErrorCode(null)

    startTransition(async () => {
      const result = await signInWithEmailAndPasswordAction({
        email: values.email,
        password: values.password,
        callbackURL: buildCallbackUrl(),
        embedded: true,
      })

      if (result.ok) {
        await refetchSession()
        onSuccess()
        return
      }

      if (result.code === ACCOUNT_DEACTIVATED) {
        setReactivateOpen(true)
      } else {
        setErrorCode(result.code ?? UNKNOWN_ERROR_CODE)
      }
    })
  })

  const handleReactivateConfirm = () => {
    const { email, password } = form.getValues()

    if (!email || !password) return
    setErrorCode(null)
    setReactivateError(null)

    startReactivateTransition(async () => {
      const result = await reactivateAndSignInAction({
        email,
        password,
        callbackURL: buildCallbackUrl(),
        embedded: true,
      })

      if (result.ok) {
        await refetchSession()
        setReactivateOpen(false)
        onSuccess()
        return
      }

      setReactivateError(texts.errorGeneric)
      setErrorCode(result.code ?? UNKNOWN_ERROR_CODE)
    })
  }

  const emailValue = form.watch("email")

  const handleSignInWithGoogle = () => {
    setGoogleLoading(true)
    startTransition(async () => {
      try {
        await signInWithGoogleAction(buildCallbackUrl())
      } catch {
        /* OAuth redirect */
      } finally {
        setGoogleLoading(false)
      }
    })
  }

  const isFormLoading = isPending
  const isReactivateLoading = isReactivatePending

  const formContent = (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          {errorCode === "EMAIL_NOT_VERIFIED" && (
            <div className="flex w-full flex-col gap-2 rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground">{texts.emailNotVerified}</p>
              <p className="text-xs text-balance text-muted-foreground">{texts.emailNotVerifiedHint}</p>
            </div>
          )}
          {errorCode && errorCode !== "EMAIL_NOT_VERIFIED" && errorCode !== ACCOUNT_DEACTIVATED && (
            <p className="text-red-500">{getSignInErrorMessageKey(errorCode)}</p>
          )}
        </div>
        <Field className="flex flex-col gap-2 pt-2">
          <Button
            variant="outline"
            type="button"
            isLoading={googleLoading}
            disabled={isFormLoading || googleLoading}
            onClick={handleSignInWithGoogle}
            aria-label={texts.signInWithGoogle}
            className="h-11 rounded-xl"
          >
            <GoogleIcon className="size-4" />
            <span className="">{texts.signInWithGoogle}</span>
          </Button>
        </Field>
        <FieldSeparator className="my-1">{texts.orContinueWith}</FieldSeparator>

        <Field data-invalid={Boolean(form.formState.errors.email)}>
          <FieldLabel htmlFor="email" className="ml-0.5">
            {texts.email}
          </FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={texts.emailPlaceholder}
            aria-invalid={Boolean(form.formState.errors.email)}
            required
              className="h-11 rounded-xl px-4"
            {...form.register("email", {
              onChange: () => {
                if (errorCode) setErrorCode(null)
              },
            })}
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
        <Field data-invalid={Boolean(form.formState.errors.password)} className="ml-0.5">
          <div className="flex items-center">
            <FieldLabel htmlFor="password">{texts.password}</FieldLabel>
            <button
              type="button"
              onClick={onForgotPassword}
              className="ml-auto text-xs underline-offset-2 hover:underline"
            >
              {texts.forgotPassword}
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              aria-invalid={Boolean(form.formState.errors.password)}
              autoComplete="current-password"
              placeholder="**********"
              required
              className="h-11 rounded-xl px-4 pr-10"
              {...form.register("password", {
                onChange: () => {
                  if (errorCode) setErrorCode(null)
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? texts.hidePassword : texts.showPassword}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            </button>
          </div>
          {form.formState.errors.password?.message && (
            <FieldError errors={[{ message: form.formState.errors.password.message }]} />
          )}
        </Field>
        <div className="py-1" />
        <Field>
          <Button
            className="h-11 w-full rounded-full text-sm font-medium"
            type="submit"
            isLoading={isFormLoading}
            disabled={isFormLoading || googleLoading}
            aria-label={texts.signIn}
            featureStylesEnabled
          >
            {texts.signIn}
          </Button>
        </Field>

        <FieldDescription className="flex items-center justify-center gap-1 pt-2 text-center text-xs">
          <span className="text-muted-foreground">{texts.noAccountSignUp}</span>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="cursor-pointer text-primary underline underline-offset-2"
          >
            {texts.signUp}
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  )

  const reactivateDialog = (
    <SignInReactivateDialog
      open={reactivateOpen}
      onOpenChange={setReactivateOpen}
      isReactivateLoading={isReactivateLoading}
      reactivateError={reactivateError}
      onConfirm={handleReactivateConfirm}
      onReactivateReset={() => setReactivateError(null)}
    />
  )

  return (
    <div className="space-y-3">
      <div className="space-y-1 text-center">
        <div className="mb-4 flex items-center justify-center">
          <LogoIcon iconSize={28} containerSize={38} />
        </div>
        <h1 className="text-2xl font-medium tracking-[-1px] text-foreground">
          {texts.signInTitle.replace("{name}", SiteConfig.name)}
        </h1>
        <p className="text-sm text-muted-foreground">{texts.signInDescription}</p>
      </div>
      {formContent}
      {reactivateDialog}
    </div>
  )
}
