"use client"

import type { User } from "better-auth"
import { ArrowUpRight, CircleHelp, CreditCard, FileText, Info, LogOut, Settings, UserRoundCheck } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth/auth-client"
import { WebRoutes } from "@/lib/web.routes"
import type { UserButtonProps } from "@/features/auth/types/user-button.types"
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoSvg } from "@/components/ui/icons/logo.icon"

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

export function UserButton({ user, isAdmin = false, isImpersonating = false }: UserButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const planPickerDialog = usePlanPickerDialog()
  const subscriptionQuery = useFetchBillingSubscription()
  const portalSessionMutation = useMutateCreatePortalSession()
  const hasResolvedBillingStatus = subscriptionQuery.isSuccess
  const isPaid = subscriptionQuery.data?.isPaid ?? false
  const isFreeUser = hasResolvedBillingStatus && !isPaid
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

  const handleStopImpersonation = () => {
    startTransition(async () => {
      await authClient.admin.stopImpersonating()
    })
  }

  const handleStartImpersonation = () => {
    const userId = window.prompt("Enter the target user ID to impersonate")
    if (!userId?.trim()) {
      return
    }

    startTransition(async () => {
      try {
        await authClient.admin.impersonateUser({ userId: userId.trim() })
      } catch {
        toast.error("Failed to impersonate user.")
      }
    })
  }

  const handleUpgradeClick = () => {
    planPickerDialog?.openPlanPickerDialog()
    trackBillingEvent({
      type: BILLING_TRACKING_EVENTS.ctaClicked,
      source: "sidebar_upgrade_cta",
      plan: "free",
    })
  }

  const helpLinks = [
    {
      label: "Help Center",
      href: WebRoutes.contact.path,
      icon: CircleHelp,
    },
    {
      label: "Terms of Service",
      href: WebRoutes.termsOfService.path,
      icon: FileText,
    },
    {
      label: "Privacy Policy",
      href: WebRoutes.privacyPolicy.path,
      icon: Info,
    },
  ] as const
  const planLabel = isPaid ? "Manage plan" : "Upgrade plan"
  const billingLabel = isBillingLoading ? "Opening billing..." : planLabel
  let planStatusLabel = ""
  if (hasResolvedBillingStatus) {
    planStatusLabel = isPaid ? "Pro" : "Free"
  }

  return (
    <>
      <div className="flex w-full items-center gap-2 px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer px-0!">
            <Button
              type="button"
              variant="ghost"
              className="h-10 min-w-0 flex-1 justify-start gap-2 px-2! py-2! hover:bg-input/50"
              aria-label="Open account menu"
            >
              <Avatar className="size-7">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                <AvatarFallback>{getInitial(user.email)}</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{getDisplayName(user)}</span>
                <span className="truncate text-xs text-muted-foreground">{planStatusLabel}</span>
              </div>
              {isFreeUser ? (
                <span className="inline-flex h-7 shrink-0 items-center rounded-full border border-border bg-background px-2.5 text-xs font-medium text-foreground shadow-xs">
                  Upgrade
                </span>
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="ml-2 w-72 max-w-[calc(100vw-16px)]">
            <DropdownMenuLabel className="py-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                  <AvatarFallback>{getInitial(user.email)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-medium text-foreground">{getDisplayName(user)}</p>
                  <p className="truncate text-sm font-normal text-muted-foreground">{planStatusLabel}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {hasResolvedBillingStatus ? (
              <DropdownMenuItem
                className="group text-base"
                onClick={isPaid ? handleManageBilling : handleUpgradeClick}
                disabled={isPaid ? isBillingLoading : planPickerDialog?.isPlanPickerCheckoutLoading}
              >
                {isPaid ? (
                  <CreditCard className="mr-2 h-4 w-4" />
                ) : (
                  <LogoSvg className="mr-2 h-4 w-4 text-amber-500!" />
                )}
                {isPaid ? billingLabel : planLabel}
                <ArrowUpRight className="ml-auto size-4 translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem className="group text-base" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
              <ArrowUpRight className="ml-auto size-4 translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="group text-base">
                <CircleHelp className="mr-2 h-4 w-4" />
                Help
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-64">
                {helpLinks.map((item) => (
                  <DropdownMenuItem key={item.label} asChild className="group text-base">
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                      <ArrowUpRight className="ml-auto size-4 translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            {isAdmin && !isImpersonating ? (
              <DropdownMenuItem onClick={handleStartImpersonation} disabled={isPending}>
                <UserRoundCheck className="mr-2 h-4 w-4" />
                Impersonate by user ID
              </DropdownMenuItem>
            ) : null}
            {isImpersonating ? (
              <DropdownMenuItem onClick={handleStopImpersonation} disabled={isPending}>
                <UserRoundCheck className="mr-2 h-4 w-4" />
                {isPending ? "Switching back..." : "Stop impersonation"}
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="group text-base" onClick={handleSignOut} disabled={isPending}>
              <LogOut className="mr-2 h-4 w-4" />
              {isPending ? "Logging out..." : "Log out"}
              <ArrowUpRight className="ml-auto size-4 translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isSettingsOpen ? <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} /> : null}
    </>
  )
}
