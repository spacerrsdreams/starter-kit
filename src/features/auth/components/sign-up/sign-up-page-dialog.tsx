"use client"

import { useRouter } from "next/navigation"

import { WebRoutes } from "@/lib/web.routes"
import { SignUpForm } from "@/features/auth/components/sign-up/sign-up-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function SignUpPageDialog() {
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
        <SignUpForm onSuccess={handleSuccess} onSwitchToSignIn={() => router.push(WebRoutes.signIn.path)} />
      </DialogContent>
    </Dialog>
  )
}
