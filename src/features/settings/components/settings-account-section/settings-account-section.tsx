"use client"

import { CheckCircle2, Key, KeyRound, Mail, ShieldAlert, UserX } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { authClient } from "@/features/auth/lib/auth-client"
import { requestPasswordResetAction } from "@/features/auth/lib/auth.actions"
import { getPasskeyStatusAction } from "@/features/settings/actions/get-passkey-status.action"
import { getPasswordStatusAction } from "@/features/settings/actions/get-password-status.action"
import { sendEmailVerificationAction } from "@/features/settings/actions/send-email-verification.action"
import { useSettingsAccountUiState } from "@/features/settings/hooks/use-settings-account-ui-state"
import { usePasskeyStatusStore } from "@/features/settings/store/passkey-status.store"
import type {
  SendEmailVerificationActionErrorCode,
  SettingsAccountSessionUser,
} from "@/features/settings/types/settings.types"
import { formatResendTime } from "@/features/settings/utils/settings-account-section.utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { SettingsAccountSectionLayout } from "./settings-account-section-layout"

export function SettingsAccountSection() {
  const t = useTranslations()
  const router = useRouter()
  const { data: session, refetch: refetchSession } = authClient.useSession()
  const user = session?.user as SettingsAccountSessionUser | undefined
  const isEmailVerified = user?.emailVerified === true
  const isTwoFactorEnabled = user?.twoFactorEnabled === true
  const { ui, patchUi } = useSettingsAccountUiState()
  const hasPasskeyHint = usePasskeyStatusStore((state) => state.hasPasskeyHint)
  const setHasPasskeyHint = usePasskeyStatusStore((state) => state.setHasPasskeyHint)

  useEffect(() => {
    if (ui.resendCooldown <= 0) return

    const timer = setTimeout(() => {
      patchUi({ resendCooldown: Math.max(0, ui.resendCooldown - 1) })
    }, 1000)

    return () => clearTimeout(timer)
  }, [patchUi, ui.resendCooldown])

  useEffect(() => {
    if (ui.passwordResetCooldown <= 0) return

    const timer = setTimeout(() => {
      patchUi({ passwordResetCooldown: Math.max(0, ui.passwordResetCooldown - 1) })
    }, 1000)

    return () => clearTimeout(timer)
  }, [patchUi, ui.passwordResetCooldown])

  useEffect(() => {
    let cancelled = false

    const loadPasswordStatus = async () => {
      try {
        const response = await getPasswordStatusAction()
        if (!cancelled) {
          patchUi({ hasPassword: response.ok ? response.hasPassword : false })
        }
      } catch {
        if (!cancelled) {
          patchUi({ hasPassword: false })
        }
      }
    }

    void loadPasswordStatus()

    return () => {
      cancelled = true
    }
  }, [patchUi, session?.user?.id])

  useEffect(() => {
    patchUi({ hasPasskey: hasPasskeyHint })
  }, [hasPasskeyHint, patchUi])

  useEffect(() => {
    let cancelled = false

    const loadPasskeyStatus = async () => {
      try {
        const response = await getPasskeyStatusAction()
        const hasPasskey = response.ok ? response.hasPasskey : false
        setHasPasskeyHint(hasPasskey)
        if (!cancelled) {
          patchUi({ hasPasskey })
        }
      } catch {
        setHasPasskeyHint(false)
        if (!cancelled) {
          patchUi({ hasPasskey: false })
        }
      }
    }

    void loadPasskeyStatus()

    return () => {
      cancelled = true
    }
  }, [patchUi, session?.user?.id, setHasPasskeyHint])

  const handleConfirmDeactivate = () => {
    patchUi({ isDeactivateDialogOpen: false })
    router.push(WebRoutes.feedback.path)
  }

  const getEmailVerificationErrorMessage = (code: SendEmailVerificationActionErrorCode): string => {
    if (code === "RATE_LIMITED") {
      return t("settings.account.email.errors.rateLimited")
    }

    if (code === "UNAUTHORIZED") {
      return t("settings.account.email.errors.unauthorized")
    }

    return t("settings.account.email.errors.sendFailed")
  }

  const handleSendVerification = async () => {
    if (!user?.email || ui.isSendingVerification || ui.resendCooldown > 0) {
      return
    }

    patchUi({ verificationError: null, isSendingVerification: true })

    const callbackURL = `${WebRoutes.root.withBaseUrl()}?emailVerified=1`
    const result = await sendEmailVerificationAction({ callbackURL })

    if (result.ok) {
      patchUi({
        hasSentVerification: true,
        resendCooldown: 60,
        isSendingVerification: false,
      })
      return
    }

    patchUi({
      verificationError: getEmailVerificationErrorMessage(result.code),
      isSendingVerification: false,
    })
  }

  const handleAddPasskey = async () => {
    if (ui.isAddingPasskey) {
      return
    }

    patchUi({ passkeyMessage: null, isAddingPasskey: true })

    const hasPlatformAuthenticator =
      typeof window !== "undefined" &&
      typeof window.PublicKeyCredential !== "undefined" &&
      typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function" &&
      (await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())

    await authClient.passkey.addPasskey({
      authenticatorAttachment: hasPlatformAuthenticator ? "platform" : "cross-platform",
      fetchOptions: {
        onSuccess: () => {
          setHasPasskeyHint(true)
          patchUi({
            hasPasskey: true,
            passkeyMessage: null,
          })
        },
        onError: (ctx) => {
          const isCrossDeviceLocalhost =
            !hasPlatformAuthenticator && typeof window !== "undefined" && window.location.hostname === "localhost"

          if (isCrossDeviceLocalhost) {
            patchUi({ passkeyMessage: t("settings.account.passkey.messages.crossDeviceLocalhost") })
            return
          }

          patchUi({ passkeyMessage: ctx.error.message })
        },
      },
    })

    patchUi({ isAddingPasskey: false })
  }

  const handlePasswordAction = async () => {
    if (!user?.email || ui.isSendingPasswordReset || ui.passwordResetCooldown > 0) {
      return
    }

    patchUi({ passwordMessage: null, isSendingPasswordReset: true })

    const result = await requestPasswordResetAction({
      email: user.email,
    })

    if (result.ok) {
      patchUi({
        passwordMessage: t("settings.account.password.messages.linkSent"),
        isSendingPasswordReset: false,
        passwordResetCooldown: 60,
      })
      return
    }

    patchUi({
      passwordMessage: t("settings.account.password.messages.sendFailed"),
      isSendingPasswordReset: false,
    })
  }

  const handleEnableTwoFactor = async () => {
    if (!ui.showTwoFactorPasswordStep) {
      patchUi({ showTwoFactorPasswordStep: true })
      return
    }

    if (ui.isEnablingTwoFactor || ui.twoFactorPassword.trim().length === 0) {
      return
    }

    patchUi({ twoFactorMessage: null, isEnablingTwoFactor: true })

    try {
      const response = await authClient.twoFactor.enable({
        password: ui.twoFactorPassword.trim(),
      })
      const payload = "data" in response ? response.data : response

      patchUi({
        twoFactorTotpUri: payload?.totpURI ?? null,
        twoFactorBackupCodes: payload?.backupCodes ?? [],
        twoFactorMessage: t("settings.account.twoFactor.messages.scanReady"),
      })
    } catch {
      patchUi({ twoFactorMessage: t("settings.account.twoFactor.messages.enableFailed") })
    } finally {
      patchUi({ isEnablingTwoFactor: false })
    }
  }

  const handleVerifyTwoFactorSetup = async () => {
    if (ui.isVerifyingTwoFactor || ui.twoFactorVerificationCode.trim().length === 0) {
      return
    }

    patchUi({ twoFactorMessage: null, isVerifyingTwoFactor: true })

    try {
      await authClient.twoFactor.verifyTotp({
        code: ui.twoFactorVerificationCode.trim(),
      })
      await refetchSession()
      patchUi({
        twoFactorTotpUri: null,
        twoFactorBackupCodes: [],
        twoFactorVerificationCode: "",
        twoFactorPassword: "",
        twoFactorMessage: t("settings.account.twoFactor.messages.enabled"),
      })
    } catch {
      patchUi({ twoFactorMessage: t("settings.account.twoFactor.messages.invalidCode") })
    } finally {
      patchUi({ isVerifyingTwoFactor: false })
    }
  }

  const handleDisableTwoFactor = async () => {
    if (!ui.showTwoFactorPasswordStep) {
      patchUi({ showTwoFactorPasswordStep: true })
      return
    }

    if (ui.isDisablingTwoFactor || ui.twoFactorPassword.trim().length === 0) {
      return
    }

    patchUi({ twoFactorMessage: null, isDisablingTwoFactor: true })

    try {
      await authClient.twoFactor.disable({
        password: ui.twoFactorPassword.trim(),
      })
      await refetchSession()
      patchUi({
        twoFactorTotpUri: null,
        twoFactorBackupCodes: [],
        twoFactorVerificationCode: "",
        twoFactorPassword: "",
        showTwoFactorPasswordStep: false,
        twoFactorMessage: t("settings.account.twoFactor.messages.disabled"),
      })
    } catch {
      patchUi({ twoFactorMessage: t("settings.account.twoFactor.messages.disableFailed") })
    } finally {
      patchUi({ isDisablingTwoFactor: false })
    }
  }

  let verificationButtonLabel: string
  if (ui.isSendingVerification) {
    verificationButtonLabel = t("settings.account.email.actions.sending")
  } else if (ui.resendCooldown > 0) {
    verificationButtonLabel = t("settings.account.email.actions.resendIn", {
      time: formatResendTime(ui.resendCooldown),
    })
  } else if (ui.hasSentVerification) {
    verificationButtonLabel = t("settings.account.email.actions.resend")
  } else {
    verificationButtonLabel = t("settings.account.email.actions.send")
  }

  let passwordActionLabel: string
  if (ui.isSendingPasswordReset) {
    passwordActionLabel = t("settings.account.password.actions.sending")
  } else if (ui.passwordResetCooldown > 0) {
    passwordActionLabel = t("settings.account.password.actions.resendIn", {
      time: formatResendTime(ui.passwordResetCooldown),
    })
  } else if (ui.hasPassword) {
    passwordActionLabel = t("settings.account.password.actions.change")
  } else {
    passwordActionLabel = t("settings.account.password.actions.set")
  }

  let enableTwoFactorButtonLabel: string
  if (ui.isEnablingTwoFactor) {
    enableTwoFactorButtonLabel = t("settings.account.twoFactor.actions.enabling")
  } else if (ui.showTwoFactorPasswordStep) {
    enableTwoFactorButtonLabel = t("settings.account.twoFactor.actions.confirmEnable")
  } else {
    enableTwoFactorButtonLabel = t("settings.account.twoFactor.actions.enable")
  }

  let disableTwoFactorButtonLabel: string
  if (ui.isDisablingTwoFactor) {
    disableTwoFactorButtonLabel = t("settings.account.twoFactor.actions.disabling")
  } else if (ui.showTwoFactorPasswordStep) {
    disableTwoFactorButtonLabel = t("settings.account.twoFactor.actions.confirmDisable")
  } else {
    disableTwoFactorButtonLabel = t("settings.account.twoFactor.actions.disable")
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <SettingsAccountSectionLayout
        icon={Mail}
        title={t("settings.account.email.title")}
        description={t("settings.account.email.description")}
        hasWarning={!isEmailVerified}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {user?.email ?? t("settings.account.email.noEmailFound")}
            </span>
            {isEmailVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                {t("settings.account.email.verified")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                <ShieldAlert className="h-3 w-3" />
                {t("settings.account.email.notVerified")}
              </span>
            )}
          </div>

          {!isEmailVerified && (
            <div className="flex flex-col gap-2">
              {ui.hasSentVerification && (
                <>
                  <p className="text-sm text-muted-foreground">{t("settings.account.email.messages.sent")}</p>
                  <p className="text-sm text-muted-foreground">{t("settings.account.email.messages.checkSpam")}</p>
                </>
              )}
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => void handleSendVerification()}
                disabled={ui.isSendingVerification || ui.resendCooldown > 0}
              >
                {verificationButtonLabel}
              </Button>
              {ui.verificationError && <p className="text-sm text-destructive">{ui.verificationError}</p>}
            </div>
          )}
        </div>
      </SettingsAccountSectionLayout>

      <Separator />

      <SettingsAccountSectionLayout
        icon={Key}
        title={t("settings.account.password.title")}
        description={t("settings.account.password.description")}
      >
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit rounded-xl"
            onClick={() => void handlePasswordAction()}
            disabled={ui.isSendingPasswordReset || ui.passwordResetCooldown > 0 || !user?.email || ui.hasPassword === null}
          >
            {passwordActionLabel}
          </Button>
          {ui.passwordMessage && <p className="text-sm text-muted-foreground">{ui.passwordMessage}</p>}
        </div>
      </SettingsAccountSectionLayout>

      <Separator />

      <SettingsAccountSectionLayout
        icon={KeyRound}
        title={t("settings.account.passkey.title")}
        description={t("settings.account.passkey.description")}
      >
        <div className="flex flex-col gap-2">
          {ui.hasPasskey ? (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="h-3 w-3" />
              {t("settings.account.passkey.status.added")}
            </span>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit rounded-xl"
              onClick={() => void handleAddPasskey()}
              disabled={ui.isAddingPasskey}
            >
              {ui.isAddingPasskey
                ? t("settings.account.passkey.actions.adding")
                : t("settings.account.passkey.actions.add")}
            </Button>
          )}
          {ui.passkeyMessage && <p className="text-sm text-muted-foreground">{ui.passkeyMessage}</p>}
        </div>
      </SettingsAccountSectionLayout>

      <Separator />

      <SettingsAccountSectionLayout
        icon={ShieldAlert}
        title={t("settings.account.twoFactor.title")}
        description={t("settings.account.twoFactor.description")}
      >
        <div className="flex flex-col gap-3">
          <span className="text-sm text-muted-foreground">
            {isTwoFactorEnabled
              ? t("settings.account.twoFactor.status.enabled")
              : t("settings.account.twoFactor.status.disabled")}
          </span>
          {ui.showTwoFactorPasswordStep && (
            <Input
              type="password"
              value={ui.twoFactorPassword}
              onChange={(event) => patchUi({ twoFactorPassword: event.target.value })}
              placeholder={t("settings.account.twoFactor.passwordPlaceholder")}
              className="max-w-sm rounded-xl"
            />
          )}
          {!isTwoFactorEnabled && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit rounded-xl"
              onClick={() => void handleEnableTwoFactor()}
              disabled={ui.isEnablingTwoFactor || (ui.showTwoFactorPasswordStep && ui.twoFactorPassword.trim().length === 0)}
            >
              {enableTwoFactorButtonLabel}
            </Button>
          )}
          {isTwoFactorEnabled && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit rounded-xl"
              onClick={() => void handleDisableTwoFactor()}
              disabled={ui.isDisablingTwoFactor || (ui.showTwoFactorPasswordStep && ui.twoFactorPassword.trim().length === 0)}
            >
              {disableTwoFactorButtonLabel}
            </Button>
          )}
          {ui.twoFactorTotpUri && (
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
              <p>{t("settings.account.twoFactor.messages.scanInstruction")}</p>
              <p className="mt-1 font-mono text-xs break-all">{ui.twoFactorTotpUri}</p>
              <Input
                type="text"
                value={ui.twoFactorVerificationCode}
                onChange={(event) => patchUi({ twoFactorVerificationCode: event.target.value })}
                placeholder={t("settings.account.twoFactor.codePlaceholder")}
                className="mt-3 rounded-xl bg-background"
              />
              <Button
                type="button"
                size="sm"
                className="mt-2 rounded-xl"
                onClick={() => void handleVerifyTwoFactorSetup()}
                disabled={ui.isVerifyingTwoFactor || ui.twoFactorVerificationCode.trim().length === 0}
              >
                {ui.isVerifyingTwoFactor
                  ? t("settings.account.twoFactor.actions.verifying")
                  : t("settings.account.twoFactor.actions.verify")}
              </Button>
            </div>
          )}
          {ui.twoFactorBackupCodes.length > 0 && (
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
              <p className="mb-2">{t("settings.account.twoFactor.messages.backupCodes")}</p>
              <p className="font-mono text-xs">{ui.twoFactorBackupCodes.join(" • ")}</p>
            </div>
          )}
          {ui.twoFactorMessage && <p className="text-sm text-muted-foreground">{ui.twoFactorMessage}</p>}
        </div>
      </SettingsAccountSectionLayout>

      <Separator />

      <SettingsAccountSectionLayout
        icon={UserX}
        title={t("settings.account.deactivate.title")}
        description={t("settings.account.deactivate.description", { name: SiteConfig.name })}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => patchUi({ isDeactivateDialogOpen: true })}
        >
          <UserX className="mr-2 h-3.5 w-3.5" />
          {t("settings.account.deactivate.action")}
        </Button>
        <Dialog open={ui.isDeactivateDialogOpen} onOpenChange={(open) => patchUi({ isDeactivateDialogOpen: open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("settings.account.deactivate.dialog.title")}</DialogTitle>
              <DialogDescription>{t("settings.account.deactivate.dialog.description")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => patchUi({ isDeactivateDialogOpen: false })}>
                {t("settings.account.deactivate.dialog.cancel")}
              </Button>
              <Button type="button" variant="destructive" onClick={handleConfirmDeactivate}>
                {t("settings.account.deactivate.dialog.confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SettingsAccountSectionLayout>
    </div>
  )
}
