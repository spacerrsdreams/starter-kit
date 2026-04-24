"use client"

import { useCallback, useState } from "react"
import type { Route } from "next"
import { useRouter } from "next/navigation"

import { ApiRoutes } from "@/lib/api.routes"
import { WebRoutes } from "@/lib/web.routes"
import {
  AuthRequiredModalContext,
  type AuthRequiredModalProviderProps,
} from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { AuthRequiredModalDialogLazy } from "@/features/auth/components/auth-required-modal/auth-required-modal-dialog.client"

export function AuthRequiredModalProvider({ children }: AuthRequiredModalProviderProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "forgot">("signin")
  const [redirectPath, setRedirectPath] = useState<string>(WebRoutes.dashboard.path)

  const callbackURL = `${ApiRoutes.authSignedIn}?${new URLSearchParams({
    next: redirectPath,
  }).toString()}`

  const openAuthModal = useCallback((options?: { redirectPath?: string }) => {
    setActiveTab("signin")
    setRedirectPath(options?.redirectPath ?? WebRoutes.dashboard.path)
    setOpen(true)
  }, [])

  const handleSignInSuccess = useCallback(() => {
    setOpen(false)
    router.push(redirectPath as Route)
  }, [redirectPath, router])

  const handleSignUpSuccess = useCallback(() => {
    setOpen(false)
    router.push(redirectPath as Route)
  }, [redirectPath, router])

  return (
    <AuthRequiredModalContext.Provider value={{ openAuthModal }}>
      {children}
      {open ? (
        <AuthRequiredModalDialogLazy
          open={open}
          callbackURL={callbackURL}
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
