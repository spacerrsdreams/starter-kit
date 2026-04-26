"use client"

import { Settings, SparklesIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { authClient } from "@/features/auth/lib/auth-client"
import { usePlanPickerDialog } from "@/features/billing/components/plan-picker-dialog/plan-picker-dialog-context"
import { SettingsDialog } from "@/features/settings/components/settings-dialog/settings-dialog"
import { Button } from "@/components/ui/button"

import { SidebarFooterSkeleton } from "./sidebar-footer-skeleton"

const UserButton = dynamic(() => import("@/features/auth/components/user-button").then((module) => module.UserButton), {
  ssr: false,
  loading: () => <SidebarFooterSkeleton />,
})
const HelpPopover = dynamic(
  () => import("@/features/help/components/help-popover/help-popover").then((module) => module.HelpPopover),
  {
    ssr: false,
  }
)

type SessionData = ReturnType<typeof authClient.useSession>["data"]

type SidebarFooterUserActionProps = {
  isSessionPending: boolean
  session: SessionData
}

export function SidebarFooterUserAction({ isSessionPending, session }: SidebarFooterUserActionProps) {
  const t = useTranslations()
  const authModalContext = useAuthRequiredModal()
  const planPickerDialog = usePlanPickerDialog()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  if (isSessionPending) {
    return <SidebarFooterSkeleton />
  }

  if (!session?.user) {
    return (
      <div className="space-y-3">
        <div className="space-y-0 px-2">
          <Button
            type="button"
            variant="ghost"
            className="h-8 w-full justify-start rounded-md px-2 text-sm font-medium text-sidebar-foreground"
            onClick={() => planPickerDialog?.openPlanPickerDialog()}
            disabled={planPickerDialog?.isPlanPickerCheckoutLoading}
          >
            <SparklesIcon className="mr-2.5 size-4" />
            {t("dashboard.sidebarFooter.seePlansAndPricing")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-8 w-full justify-start rounded-md px-2 text-sm font-medium text-sidebar-foreground"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="mr-2.5 size-4" />
            {t("dashboard.mobileBottomNav.settings")}
          </Button>
          <HelpPopover />
        </div>

        <div className="border-t border-sidebar-border p-4 pb-3">
          <h3 className="text-sm font-semibold text-sidebar-foreground">{t("dashboard.sidebarFooter.title")}</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("dashboard.sidebarFooter.descriptionLine1")}
            <br />
            {t("dashboard.sidebarFooter.descriptionLine2")}
            <br />
            {t("dashboard.sidebarFooter.descriptionLine3")}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 h-11 w-full rounded-full border-sidebar-border bg-background text-[14px] font-semibold text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={() => authModalContext?.openAuthModal()}
          >
            {t("dashboard.sidebarFooter.logIn")}
          </Button>
        </div>

        {isSettingsOpen ? <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} /> : null}
      </div>
    )
  }

  return (
    <div className="flex w-full items-center">
      <UserButton
        user={session.user}
        isAdmin={session.user.role === "admin"}
        isImpersonating={Boolean(session.session.impersonatedBy)}
      />
    </div>
  )
}
