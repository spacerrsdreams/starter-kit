"use client"

import { useRouter } from "next/navigation"

import { WebRoutes } from "@/lib/web.routes"
import { SignInForm } from "@/features/auth/components/sign-in/sign-in-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function SignInPageDialog() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push(WebRoutes.root.path)
  }

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <SignInForm
          onSuccess={handleSuccess}
          onSwitchToSignUp={() => router.push(WebRoutes.signUp.path)}
          onForgotPassword={() => router.push(WebRoutes.resetPassword.path)}
        />
      </DialogContent>
    </Dialog>
  )
}
