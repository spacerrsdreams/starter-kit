"use client"

import { User } from "better-auth"
import { ChevronsUpDown, CreditCard, LogOut, Settings, SparklesIcon } from "lucide-react"
import { useState, useTransition } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { usePlanPickerDialog } from "@/features/billing/components/plan-picker-dialog/plan-picker-dialog-context"
import { BILLING_TRACKING_EVENTS } from "@/features/billing/constants/billing-tracking.constants"
import { useFetchBillingSubscription } from "@/features/billing/hooks/use-fetch-billing-subscription"
import { useMutateCreatePortalSession } from "@/features/billing/hooks/use-mutate-create-portal-session"
import { trackBillingEvent } from "@/features/billing/utils/track-billing-event.client"
import { SettingsDialog } from "@/features/settings/components/settings-dialog/settings-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserButtonProps = {
  user: User
}

function getInitial(email: string): string {
  const trimmed = email.trim()
  if (!trimmed) return "U"
  return trimmed[0]?.toUpperCase() ?? "U"
}

function getDisplayName(user: User): string {
  const name = user.name?.trim()
  if (name) {
    return name
  }

  const emailName = user.email.split("@")[0]?.trim()
  return emailName || "User"
}

export function UserButton({ user }: UserButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const planPickerDialog = usePlanPickerDialog()
  const subscriptionQuery = useFetchBillingSubscription()
  const portalSessionMutation = useMutateCreatePortalSession()
  const isPaid = subscriptionQuery.data?.isPaid ?? false
  const isBillingLoading = portalSessionMutation.isPending

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut()
    })
  }

  const handleManageBilling = () => {
    void (async () => {
      try {
        const response = await portalSessionMutation.mutateAsync()
        trackBillingEvent({
          type: BILLING_TRACKING_EVENTS.portalRedirected,
          source: "sidebar_upgrade_cta",
          plan: "pro",
        })
        window.location.href = response.portalUrl
      } catch {
        trackBillingEvent({
          type: BILLING_TRACKING_EVENTS.ctaFailed,
          source: "sidebar_upgrade_cta",
          plan: "pro",
        })
      }
    })()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="h-12 w-full justify-start gap-2 px-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            aria-label="Open account menu"
          >
            <Avatar>
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
              <AvatarFallback>{getInitial(user.email)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{getDisplayName(user)}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isPaid ? (
            <DropdownMenuItem onClick={handleManageBilling} disabled={isBillingLoading}>
              <CreditCard className="mr-2 h-4 w-4" />
              {isBillingLoading ? "Opening billing..." : "Manage billing"}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                planPickerDialog?.openPlanPickerDialog()
                trackBillingEvent({
                  type: BILLING_TRACKING_EVENTS.ctaClicked,
                  source: "sidebar_upgrade_cta",
                  plan: "free",
                })
              }}
              disabled={planPickerDialog?.isPlanPickerCheckoutLoading}
            >
              <SparklesIcon className="mr-2 h-4 w-4 text-amber-500" />
              Upgrade to Pro
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} disabled={isPending}>
            <LogOut className="mr-2 h-4 w-4" />
            {isPending ? "Logging out..." : "Log out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isSettingsOpen ? <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} /> : null}
    </>
  )
}
