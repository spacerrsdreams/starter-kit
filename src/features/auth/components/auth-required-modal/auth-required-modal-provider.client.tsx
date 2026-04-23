"use client"

import { useCallback, useState } from "react"

import { WebRoutes } from "@/lib/web.routes"
import {
  AuthRequiredModalContext,
  type AuthRequiredModalProviderProps,
} from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { AuthRequiredModalDialogLazy } from "@/features/auth/components/auth-required-modal/auth-required-modal-dialog.client"

export function AuthRequiredModalProvider({ children }: AuthRequiredModalProviderProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "forgot">("signin")

  const openAuthModal = useCallback(() => {
    setActiveTab("signin")
    setOpen(true)
  }, [])

  const handleSignInSuccess = useCallback(() => {
    setOpen(false)
    window.location.href = WebRoutes.dashboard.path
  }, [])

  const handleSignUpSuccess = useCallback(() => {
    setOpen(false)
    window.location.href = WebRoutes.dashboard.path
  }, [])

  return (
    <AuthRequiredModalContext.Provider value={{ openAuthModal }}>
      {children}
      {open ? (
        <AuthRequiredModalDialogLazy
          open={open}
          onOpenChange={setOpen}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSignInSuccess={handleSignInSuccess}
          onSignUpSuccess={handleSignUpSuccess}
        />
      ) : null}
    </AuthRequiredModalContext.Provider>
  )
}
