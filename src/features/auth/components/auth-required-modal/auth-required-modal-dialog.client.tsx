"use client"

import dynamic from "next/dynamic"

export type AuthRequiredModalDialogProps = {
  open: boolean
  activeTab: "signin" | "signup" | "forgot"
  onOpenChange: (open: boolean) => void
  onTabChange: (tab: "signin" | "signup" | "forgot") => void
  onSignInSuccess: () => void
  onSignUpSuccess: () => void
}

export const AuthRequiredModalDialogLazy = dynamic<AuthRequiredModalDialogProps>(
  () =>
    import("@/features/auth/components/auth-required-modal/auth-required-modal-dialog-content.client").then(
      (module) => module.AuthRequiredModalDialogContent
    ),
  {
    ssr: false,
    loading: () => null,
  }
)
