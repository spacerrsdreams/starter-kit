"use client"

import { useRouter } from "next/navigation"

import { WebRoutes } from "@/lib/web.routes"
import { SignInForm } from "@/features/auth/components/sign-in/sign-in-form"
import { GlassPanel } from "@/components/ui/glass-panel"

export function SignInPageContent() {
  const router = useRouter()

  return (
    <GlassPanel className="w-full max-w-md" size="sm">
      <SignInForm
        onSuccess={() => router.push(WebRoutes.root.path)}
        onSwitchToSignUp={() => router.push(WebRoutes.signUp.path)}
        onForgotPassword={() => router.push(WebRoutes.resetPassword.path)}
      />
    </GlassPanel>
  )
}
