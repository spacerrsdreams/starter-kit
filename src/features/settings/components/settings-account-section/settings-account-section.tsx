"use client"

import { CheckCircle2, KeyRound, Mail, ShieldAlert, UserX } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { authClient } from "@/features/auth/lib/auth-client"
import { sendEmailVerificationAction } from "@/features/settings/actions/send-email-verification.action"
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
import { Separator } from "@/components/ui/separator"

import { SettingsAccountSectionLayout } from "./settings-account-section-layout"

export function SettingsAccountSection() {
  const t = useTranslations()
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = session?.user as SettingsAccountSessionUser | undefined
  const isEmailVerified = user?.emailVerified === true
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [isSendingVerification, setIsSendingVerification] = useState(false)
  const [hasSentVerification, setHasSentVerification] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [isAddingPasskey, setIsAddingPasskey] = useState(false)
  const [passkeyMessage, setPasskeyMessage] = useState<string | null>(null)

  useEffect(() => {
    if (resendCooldown <= 0) return

    const timer = setTimeout(() => {
      setResendCooldown((previous) => Math.max(0, previous - 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [resendCooldown])

  const handleConfirmDeactivate = () => {
    setIsDeactivateDialogOpen(false)
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
    if (!user?.email || isSendingVerification || resendCooldown > 0) {
      return
    }

    setVerificationError(null)
    setIsSendingVerification(true)

    const callbackURL = `${WebRoutes.root.withBaseUrl()}?emailVerified=1`
    const result = await sendEmailVerificationAction({ callbackURL })

    if (result.ok) {
      setHasSentVerification(true)
      setResendCooldown(60)
      setIsSendingVerification(false)
      return
    }

    setVerificationError(getEmailVerificationErrorMessage(result.code))
    setIsSendingVerification(false)
  }

  const handleAddPasskey = async () => {
    if (isAddingPasskey) {
      return
    }

    setPasskeyMessage(null)
    setIsAddingPasskey(true)

    const hasPlatformAuthenticator =
      typeof window !== "undefined" &&
      typeof window.PublicKeyCredential !== "undefined" &&
      typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function" &&
      (await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())

    await authClient.passkey.addPasskey({
      authenticatorAttachment: hasPlatformAuthenticator ? "platform" : "cross-platform",
      fetchOptions: {
        onSuccess: () => {
          setPasskeyMessage(
            hasPlatformAuthenticator
              ? t("settings.account.passkey.messages.addedPlatform")
              : t("settings.account.passkey.messages.noPlatformFallback")
          )
        },
        onError: (ctx) => {
          const isCrossDeviceLocalhost =
            !hasPlatformAuthenticator && typeof window !== "undefined" && window.location.hostname === "localhost"

          if (isCrossDeviceLocalhost) {
            setPasskeyMessage(
              t("settings.account.passkey.messages.crossDeviceLocalhost")
            )
            return
          }

          setPasskeyMessage(ctx.error.message)
        },
      },
    })

    setIsAddingPasskey(false)
  }

  let verificationButtonLabel: string
  if (isSendingVerification) {
    verificationButtonLabel = t("settings.account.email.actions.sending")
  } else if (resendCooldown > 0) {
    verificationButtonLabel = t("settings.account.email.actions.resendIn", {
      time: formatResendTime(resendCooldown),
    })
  } else if (hasSentVerification) {
    verificationButtonLabel = t("settings.account.email.actions.resend")
  } else {
    verificationButtonLabel = t("settings.account.email.actions.send")
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
              {hasSentVerification && (
                <>
                  <p className="text-sm text-muted-foreground">{t("settings.account.email.messages.sent")}</p>
                  <p className="text-sm text-muted-foreground">{t("settings.account.email.messages.checkSpam")}</p>
                </>
              )}
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => void handleSendVerification()}
                disabled={isSendingVerification || resendCooldown > 0}
              >
                {verificationButtonLabel}
              </Button>
              {verificationError && <p className="text-sm text-destructive">{verificationError}</p>}
            </div>
          )}
        </div>
      </SettingsAccountSectionLayout>

      <Separator />

      <SettingsAccountSectionLayout
        icon={KeyRound}
        title={t("settings.account.passkey.title")}
        description={t("settings.account.passkey.description")}
      >
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit rounded-xl"
            onClick={() => void handleAddPasskey()}
            disabled={isAddingPasskey}
          >
            {isAddingPasskey ? t("settings.account.passkey.actions.adding") : t("settings.account.passkey.actions.add")}
          </Button>
          {passkeyMessage && <p className="text-sm text-muted-foreground">{passkeyMessage}</p>}
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
          onClick={() => setIsDeactivateDialogOpen(true)}
        >
          <UserX className="mr-2 h-3.5 w-3.5" />
          {t("settings.account.deactivate.action")}
        </Button>
        <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("settings.account.deactivate.dialog.title")}</DialogTitle>
              <DialogDescription>
                {t("settings.account.deactivate.dialog.description")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeactivateDialogOpen(false)}>
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
