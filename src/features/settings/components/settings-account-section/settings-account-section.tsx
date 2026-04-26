"use client"

import { CheckCircle2, KeyRound, Mail, ShieldAlert, UserX } from "lucide-react"
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
      return "Too many attempts. Please wait a minute and try again."
    }

    if (code === "UNAUTHORIZED") {
      return "Please sign in again to verify your email."
    }

    return "Failed to send verification email. Please try again."
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

    await authClient.passkey.addPasskey({
      fetchOptions: {
        onSuccess: () => {
          setPasskeyMessage("Passkey added successfully.")
        },
        onError: (ctx) => {
          setPasskeyMessage(ctx.error.message)
        },
      },
    })

    setIsAddingPasskey(false)
  }

  let verificationButtonLabel: string
  if (isSendingVerification) {
    verificationButtonLabel = "Sending..."
  } else if (resendCooldown > 0) {
    verificationButtonLabel = `Resend verification in ${formatResendTime(resendCooldown)}`
  } else if (hasSentVerification) {
    verificationButtonLabel = "Resend verification email"
  } else {
    verificationButtonLabel = "Send verification email"
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <SettingsAccountSectionLayout
        icon={Mail}
        title="Email address"
        description="Your account email used for sign-in and notifications."
        hasWarning={!isEmailVerified}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">{user?.email ?? "No email found"}</span>
            {isEmailVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                Email verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                <ShieldAlert className="h-3 w-3" />
                Email not verified
              </span>
            )}
          </div>

          {!isEmailVerified && (
            <div className="flex flex-col gap-2">
              {hasSentVerification && (
                <>
                  <p className="text-sm text-muted-foreground">Verification email sent. Please check your inbox.</p>
                  <p className="text-sm text-muted-foreground">If you do not see it, check your spam or junk folder.</p>
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
        title="Passkey"
        description="Add a passkey to sign in faster with biometrics or security keys."
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
            {isAddingPasskey ? "Adding passkey..." : "Add passkey"}
          </Button>
          {passkeyMessage && <p className="text-sm text-muted-foreground">{passkeyMessage}</p>}
        </div>
      </SettingsAccountSectionLayout>

      <Separator />

      <SettingsAccountSectionLayout
        icon={UserX}
        title="Deactivate account"
        description={`If you deactivate your account, your personal identifiers and records will be retained for 30 days and then permanently removed from our active systems. This action is final and ensures your data is no longer stored or processed by ${SiteConfig.name}, except where retention is required by law.`}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setIsDeactivateDialogOpen(true)}
        >
          <UserX className="mr-2 h-3.5 w-3.5" />
          Deactivate account
        </Button>
        <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deactivate account?</DialogTitle>
              <DialogDescription>
                You will be asked to submit a feedback form first. Your account will only be deactivated after feedback
                is submitted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeactivateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleConfirmDeactivate}>
                Yes, deactivate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SettingsAccountSectionLayout>
    </div>
  )
}
