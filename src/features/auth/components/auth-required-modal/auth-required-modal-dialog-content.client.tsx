"use client"

import { ApiRoutes } from "@/lib/api.routes"
import { WebRoutes } from "@/lib/web.routes"
import { RequestPasswordResetEmbeddedForm } from "@/features/auth/components/reset-password/request-password-reset-embedded-form.client"
import { SignInForm } from "@/features/auth/components/sign-in/sign-in-form.client"
import { SignUpForm } from "@/features/auth/components/sign-up/sign-up-form.client"
import type { AuthRequiredModalDialogProps } from "@/features/auth/components/auth-required-modal/auth-required-modal-dialog.client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent } from "@/components/ui/tabs"

const DASHBOARD_CALLBACK_URL = `${ApiRoutes.authSignedIn}?${new URLSearchParams({
  next: WebRoutes.dashboard.path,
}).toString()}`

export function AuthRequiredModalDialogContent({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
  onSignInSuccess,
  onSignUpSuccess,
}: AuthRequiredModalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as "signin" | "signup" | "forgot")}>
          <TabsContent value="signin" className="mt-0">
            <SignInForm
              onSuccess={onSignInSuccess}
              onSwitchToSignUp={() => onTabChange("signup")}
              onForgotPassword={() => onTabChange("forgot")}
              callbackURL={DASHBOARD_CALLBACK_URL}
            />
          </TabsContent>
          <TabsContent value="signup" className="mt-0">
            <SignUpForm
              onSuccess={onSignUpSuccess}
              onSwitchToSignIn={() => onTabChange("signin")}
              callbackURL={DASHBOARD_CALLBACK_URL}
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
