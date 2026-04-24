"use client"

import { useRouter } from "next/navigation"

import { WebRoutes } from "@/lib/web.routes"
import { SignUpForm } from "@/features/auth/components/sign-up/sign-up-form.client"
import { GlassPanel } from "@/components/ui/glass-panel"

export function SignUpPageContent() {
  const router = useRouter()

  return (
    <GlassPanel className="w-full max-w-md" size="sm">
      <SignUpForm
        onSuccess={() => router.push(WebRoutes.root.path)}
        onSwitchToSignIn={() => router.push(WebRoutes.signIn.path)}
      />
    </GlassPanel>
  )
}
