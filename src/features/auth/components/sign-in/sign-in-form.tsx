"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

import { SiteConfig } from "@/lib/site.config"
import { buildPostAuthCallbackUrl } from "@/features/auth/components/sign-in/sign-in-callback.utils"
import { getSignInErrorMessageKey } from "@/features/auth/components/sign-in/sign-in-form.utils"
import { SignInReactivateDialog } from "@/features/auth/components/sign-in/sign-in-reactivate-dialog"
import { ACCOUNT_DEACTIVATED, UNKNOWN_ERROR_CODE } from "@/features/auth/constants"
import { useSignInUiState } from "@/features/auth/hooks/use-sign-in-ui-state"
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

export function SignInForm({ onSuccess, onSwitchToSignUp, onForgotPassword, callbackURL }: SignInFormProps) {
  const t = useTranslations()
  const texts = {
    signIn: t("auth.signIn.submit"),
    signInWithGoogle: t("auth.signIn.withGoogle"),
    signInWithPasskey: t("auth.signIn.withPasskey"),
    signInWithApple: t("auth.signIn.withApple"),
    orContinueWith: t("auth.signIn.orContinueWith"),
    email: t("auth.signIn.email"),
    emailPlaceholder: t("auth.signIn.emailPlaceholder"),
    password: t("auth.signIn.password"),
    forgotPassword: t("auth.signIn.forgotPassword"),
    noAccountSignUp: `${t("auth.signIn.noAccountSignUp")} `,
    signUp: t("auth.signIn.signUp"),
    signInTitle: t("auth.signIn.title", { name: SiteConfig.name }),
    signInDescription: t("auth.signIn.description"),
    emailNotVerified: t("auth.signIn.emailNotVerified"),
    emailNotVerifiedHint: t("auth.signIn.emailNotVerifiedHint"),
    errorGeneric: t("auth.signIn.genericError"),
    hidePassword: t("auth.signIn.hidePassword"),
    showPassword: t("auth.signIn.showPassword"),
    twoFactorTitle: t("auth.signIn.twoFactor.title"),
    twoFactorDescription: t("auth.signIn.twoFactor.description"),
    twoFactorCodeLabel: t("auth.signIn.twoFactor.codeLabel"),
    twoFactorCodePlaceholder: t("auth.signIn.twoFactor.codePlaceholder"),
    twoFactorBackupCodeLabel: t("auth.signIn.twoFactor.backupCodeLabel"),
    twoFactorBackupCodePlaceholder: t("auth.signIn.twoFactor.backupCodePlaceholder"),
    twoFactorUseBackupCode: t("auth.signIn.twoFactor.useBackupCode"),
    twoFactorUseAuthenticatorCode: t("auth.signIn.twoFactor.useAuthenticatorCode"),
    twoFactorVerify: t("auth.signIn.twoFactor.verify"),
    twoFactorVerifying: t("auth.signIn.twoFactor.verifying"),
    twoFactorInvalidCode: t("auth.signIn.twoFactor.invalidCode"),
    lastUsed: t("auth.signIn.lastUsed"),
  }

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { refetch: refetchSession } = authClient.useSession()
  const { ui, patchUi } = useSignInUiState()
  const lastUsedLoginMethod = authClient.getLastUsedLoginMethod()
  const [isPending, startTransition] = useTransition()
  const [isReactivatePending, startReactivateTransition] = useTransition()

  useEffect(() => {
    let cancelled = false

    const detectPasskeyAvailability = async () => {
      if (typeof window === "undefined" || typeof window.PublicKeyCredential === "undefined") {
        if (!cancelled) {
          patchUi({ canUsePasskeyOnDevice: false })
        }
        return
      }

      try {
        const isConditionalMediationAvailable =
          typeof window.PublicKeyCredential.isConditionalMediationAvailable === "function" &&
          (await window.PublicKeyCredential.isConditionalMediationAvailable())

        if (!cancelled) {
          patchUi({ canUsePasskeyOnDevice: isConditionalMediationAvailable })
        }

        if (isConditionalMediationAvailable) {
          await authClient.signIn.passkey({ autoFill: true })
        }
      } catch {
        if (!cancelled) {
          patchUi({ canUsePasskeyOnDevice: false })
        }
      }
    }

    void detectPasskeyAvailability()

    return () => {
      cancelled = true
    }
  }, [patchUi])

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
    patchUi({ errorCode: null, twoFactorError: null })

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

      if (result.code === "TWO_FACTOR_REQUIRED") {
        patchUi({ isTwoFactorRequired: true, twoFactorCode: "" })
        return
      }

      if (result.code === ACCOUNT_DEACTIVATED) {
        patchUi({ reactivateOpen: true })
      } else {
        patchUi({ errorCode: result.code ?? UNKNOWN_ERROR_CODE })
      }
    })
  })

  const handleReactivateConfirm = () => {
    const { email, password } = form.getValues()

    if (!email || !password) return
    patchUi({ errorCode: null, reactivateError: null })

    startReactivateTransition(async () => {
      const result = await reactivateAndSignInAction({
        email,
        password,
        callbackURL: buildCallbackUrl(),
        embedded: true,
      })

      if (result.ok) {
        await refetchSession()
        patchUi({ reactivateOpen: false })
        onSuccess()
        return
      }

      if (result.code === "TWO_FACTOR_REQUIRED") {
        patchUi({
          reactivateOpen: false,
          isTwoFactorRequired: true,
          twoFactorCode: "",
          twoFactorError: null,
        })
        return
      }

      patchUi({
        reactivateError: texts.errorGeneric,
        errorCode: result.code ?? UNKNOWN_ERROR_CODE,
      })
    })
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const emailValue = form.watch("email")

  const handleSignInWithGoogle = () => {
    patchUi({ isTwoFactorRequired: false, googleLoading: true })
    startTransition(async () => {
      try {
        await signInWithGoogleAction(buildCallbackUrl())
      } catch {
        /* OAuth redirect */
      } finally {
        patchUi({ googleLoading: false })
      }
    })
  }

  const handleSignInWithPasskey = () => {
    patchUi({
      isTwoFactorRequired: false,
      errorCode: null,
      passkeyLoading: true,
    })
    startTransition(async () => {
      try {
        await authClient.signIn.passkey({
          fetchOptions: {
            onSuccess: async () => {
              await refetchSession()
              onSuccess()
            },
            onError: (ctx) => {
              patchUi({ errorCode: ctx.error.code ?? UNKNOWN_ERROR_CODE })
            },
          },
        })
      } catch {
        patchUi({ errorCode: UNKNOWN_ERROR_CODE })
      } finally {
        patchUi({ passkeyLoading: false })
      }
    })
  }

  const isFormLoading = isPending
  const isReactivateLoading = isReactivatePending

  const handleVerifyTwoFactor = () => {
    if (ui.isVerifyingTwoFactor || ui.twoFactorCode.trim().length === 0) {
      return
    }

    patchUi({ twoFactorError: null, isVerifyingTwoFactor: true })

    startTransition(async () => {
      try {
        if (ui.isUsingBackupCode) {
          await authClient.twoFactor.verifyBackupCode({
            code: ui.twoFactorCode.trim(),
          })
        } else {
          await authClient.twoFactor.verifyTotp({
            code: ui.twoFactorCode.trim(),
          })
        }

        await refetchSession()
        onSuccess()
      } catch {
        patchUi({ twoFactorError: texts.twoFactorInvalidCode })
      } finally {
        patchUi({ isVerifyingTwoFactor: false })
      }
    })
  }

  const formContent = (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          {ui.errorCode === "EMAIL_NOT_VERIFIED" && (
            <div className="flex w-full flex-col gap-2 rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground">{texts.emailNotVerified}</p>
              <p className="text-xs text-balance text-muted-foreground">{texts.emailNotVerifiedHint}</p>
            </div>
          )}
          {ui.errorCode && ui.errorCode !== "EMAIL_NOT_VERIFIED" && ui.errorCode !== ACCOUNT_DEACTIVATED && (
            <p className="text-red-500">{getSignInErrorMessageKey(ui.errorCode)}</p>
          )}
        </div>
        <Field className="flex flex-col gap-2 pt-2">
          {ui.canUsePasskeyOnDevice && (
            <Button
              variant="outline"
              type="button"
              isLoading={ui.passkeyLoading}
              disabled={isFormLoading || ui.googleLoading || ui.passkeyLoading}
              onClick={handleSignInWithPasskey}
              aria-label={texts.signInWithPasskey}
              className="h-11 rounded-xl"
            >
              <span className="">{texts.signInWithPasskey}</span>
              {lastUsedLoginMethod === "passkey" && (
                <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {texts.lastUsed}
                </span>
              )}
            </Button>
          )}
          <Button
            variant="outline"
            type="button"
            isLoading={ui.googleLoading}
            disabled={isFormLoading || ui.googleLoading || ui.passkeyLoading}
            onClick={handleSignInWithGoogle}
            aria-label={texts.signInWithGoogle}
            className="h-11 rounded-xl"
          >
            <GoogleIcon className="size-4" />
            <span className="">{texts.signInWithGoogle}</span>
            {lastUsedLoginMethod === "google" && (
              <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {texts.lastUsed}
              </span>
            )}
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
            autoComplete="email webauthn"
            placeholder={texts.emailPlaceholder}
            aria-invalid={Boolean(form.formState.errors.email)}
            required
            className="h-11 rounded-xl px-4"
            {...form.register("email", {
              onChange: () => {
                if (ui.errorCode) patchUi({ errorCode: null })
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
          autoComplete="username webauthn"
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
              type={ui.showPassword ? "text" : "password"}
              aria-invalid={Boolean(form.formState.errors.password)}
              autoComplete="current-password webauthn"
              placeholder="**********"
              required
              className="h-11 rounded-xl px-4 pr-10"
              {...form.register("password", {
                onChange: () => {
                  if (ui.errorCode) patchUi({ errorCode: null })
                },
              })}
            />
            <button
              type="button"
              onClick={() => patchUi({ showPassword: !ui.showPassword })}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={ui.showPassword ? texts.hidePassword : texts.showPassword}
              tabIndex={-1}
            >
              {ui.showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
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
            disabled={isFormLoading || ui.googleLoading || ui.passkeyLoading}
            aria-label={texts.signIn}
            featureStylesEnabled
          >
            {texts.signIn}
            {lastUsedLoginMethod === "email" && (
              <span className="ml-2 inline-flex items-center rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium text-foreground">
                {texts.lastUsed}
              </span>
            )}
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

  const twoFactorContent = (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h2 className="text-base font-medium text-foreground">{texts.twoFactorTitle}</h2>
        <p className="text-sm text-muted-foreground">{texts.twoFactorDescription}</p>
      </div>
      <FieldGroup className="gap-3">
        {ui.twoFactorError && <p className="text-sm text-destructive">{ui.twoFactorError}</p>}
        <Field>
          <FieldLabel htmlFor="two-factor-code" className="ml-0.5">
            {ui.isUsingBackupCode ? texts.twoFactorBackupCodeLabel : texts.twoFactorCodeLabel}
          </FieldLabel>
          <Input
            id="two-factor-code"
            value={ui.twoFactorCode}
            onChange={(event) => {
              patchUi({ twoFactorCode: event.target.value })
              if (ui.twoFactorError) {
                patchUi({ twoFactorError: null })
              }
            }}
            autoComplete="one-time-code"
            placeholder={ui.isUsingBackupCode ? texts.twoFactorBackupCodePlaceholder : texts.twoFactorCodePlaceholder}
            className="h-11 rounded-xl px-4"
          />
        </Field>
        <Field>
          <Button
            type="button"
            className="h-11 w-full rounded-full text-sm font-medium"
            onClick={handleVerifyTwoFactor}
            isLoading={ui.isVerifyingTwoFactor}
            disabled={ui.isVerifyingTwoFactor || ui.twoFactorCode.trim().length === 0}
            featureStylesEnabled
          >
            {ui.isVerifyingTwoFactor ? texts.twoFactorVerifying : texts.twoFactorVerify}
          </Button>
        </Field>
        <FieldDescription className="flex items-center justify-center pt-1 text-center text-xs">
          <button
            type="button"
            className="cursor-pointer text-primary underline underline-offset-2"
            onClick={() => {
              patchUi({
                isUsingBackupCode: !ui.isUsingBackupCode,
                twoFactorCode: "",
                twoFactorError: null,
              })
            }}
          >
            {ui.isUsingBackupCode ? texts.twoFactorUseAuthenticatorCode : texts.twoFactorUseBackupCode}
          </button>
        </FieldDescription>
      </FieldGroup>
    </div>
  )

  const reactivateDialog = (
    <SignInReactivateDialog
      open={ui.reactivateOpen}
      onOpenChange={(open) => patchUi({ reactivateOpen: open })}
      isReactivateLoading={isReactivateLoading}
      reactivateError={ui.reactivateError}
      onConfirm={handleReactivateConfirm}
      onReactivateReset={() => patchUi({ reactivateError: null })}
    />
  )

  return (
    <div className="space-y-3">
      <div className="space-y-1 text-center">
        <div className="mb-4 flex items-center justify-center">
          <LogoIcon iconSize={28} containerSize={38} />
        </div>
        <h1 className="text-2xl font-medium tracking-[-1px] text-foreground">{texts.signInTitle}</h1>
        <p className="text-sm text-muted-foreground">{texts.signInDescription}</p>
      </div>
      {ui.isTwoFactorRequired ? twoFactorContent : formContent}
      {reactivateDialog}
    </div>
  )
}
