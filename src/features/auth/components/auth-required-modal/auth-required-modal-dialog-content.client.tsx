"use client"

import type { AuthRequiredModalDialogProps } from "@/features/auth/components/auth-required-modal/auth-required-modal-dialog.client"
import { RequestPasswordResetEmbeddedForm } from "@/features/auth/components/reset-password/request-password-reset-embedded-form.client"
import { SignInForm } from "@/features/auth/components/sign-in/sign-in-form.client"
import { SignUpForm } from "@/features/auth/components/sign-up/sign-up-form.client"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent } from "@/components/ui/tabs"

export function AuthRequiredModalDialogContent({
  open,
  onOpenChange,
  activeTab,
  callbackURL,
  onTabChange,
  onSignInSuccess,
  onSignUpSuccess,
}: AuthRequiredModalDialogProps) {
  const dialogTitleByTab = {
    signin: "Sign in required",
    signup: "Create your account",
    forgot: "Reset your password",
  } as const

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className="sr-only">{dialogTitleByTab[activeTab]}</DialogTitle>
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as "signin" | "signup" | "forgot")}>
          <TabsContent value="signin" className="mt-0">
            <SignInForm
              onSuccess={onSignInSuccess}
              onSwitchToSignUp={() => onTabChange("signup")}
              onForgotPassword={() => onTabChange("forgot")}
              callbackURL={callbackURL}
            />
          </TabsContent>
          <TabsContent value="signup" className="mt-0">
            <SignUpForm
              onSuccess={onSignUpSuccess}
              onSwitchToSignIn={() => onTabChange("signin")}
              callbackURL={callbackURL}
            />
          </TabsContent>
          <TabsContent value="forgot" className="mt-0">
            <RequestPasswordResetEmbeddedForm onBackToSignIn={() => onTabChange("signin")} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
