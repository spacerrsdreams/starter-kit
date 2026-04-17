"use client"

import { User } from "better-auth"
import { Check, ChevronsUpDown, CreditCard, LogOut, Settings, SparklesIcon } from "lucide-react"
import { useState, useTransition } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { BILLING_TRACKING_EVENTS } from "@/features/billing/constants/billing-tracking.constants"
import { useFetchBillingSubscription } from "@/features/billing/hooks/use-fetch-billing-subscription"
import { useMutateCreateCheckoutSession } from "@/features/billing/hooks/use-mutate-create-checkout-session"
import { useMutateCreatePortalSession } from "@/features/billing/hooks/use-mutate-create-portal-session"
import { trackBillingEvent } from "@/features/billing/utils/track-billing-event.client"
import { SettingsDialog } from "@/features/settings/components/settings-dialog/settings-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

const MONTHLY_PLAN_FEATURES = ["Unlimited chat sessions", "Priority response speed", "Early access to new tools"]

const YEARLY_PLAN_FEATURES = [
  "Everything in Monthly",
  "2 months free vs monthly billing",
  "Fewer renewals, smoother budgeting",
]

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
  const [isPlanPickerOpen, setIsPlanPickerOpen] = useState(false)
  const subscriptionQuery = useFetchBillingSubscription()
  const checkoutSessionMutation = useMutateCreateCheckoutSession()
  const portalSessionMutation = useMutateCreatePortalSession()
  const isPaid = subscriptionQuery.data?.isPaid ?? false
  const isBillingLoading = checkoutSessionMutation.isPending || portalSessionMutation.isPending

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

  const handleStartCheckout = (interval: "monthly" | "yearly") => {
    void (async () => {
      try {
        const response = await checkoutSessionMutation.mutateAsync({ interval })
        trackBillingEvent({
          type: BILLING_TRACKING_EVENTS.checkoutRedirected,
          source: "sidebar_upgrade_cta",
          plan: "free",
        })
        window.location.href = response.checkoutUrl
      } catch {
        trackBillingEvent({
          type: BILLING_TRACKING_EVENTS.ctaFailed,
          source: "sidebar_upgrade_cta",
          plan: "free",
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
                setIsPlanPickerOpen(true)
                trackBillingEvent({
                  type: BILLING_TRACKING_EVENTS.ctaClicked,
                  source: "sidebar_upgrade_cta",
                  plan: "free",
                })
              }}
              disabled={isBillingLoading}
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
      <Dialog open={isPlanPickerOpen} onOpenChange={setIsPlanPickerOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full bg-primary/10 px-2.5 text-primary">
                Pro
              </Badge>
              <Badge variant="outline" className="rounded-full">
                Secure checkout
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-semibold tracking-tight">Choose your Pro plan</DialogTitle>
            <DialogDescription>
              Pick the billing style that fits you best. You can switch anytime from billing settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-base font-semibold">Pro Monthly</p>
                <Badge variant="outline" className="rounded-full">
                  Flexible
                </Badge>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">Perfect if you want to stay month-to-month.</p>
              <ul className="mb-4 space-y-2">
                {MONTHLY_PLAN_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                className="w-full"
                disabled={isBillingLoading}
                onClick={() => handleStartCheckout("monthly")}
              >
                Continue with Monthly
              </Button>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-base font-semibold">Pro Yearly</p>
                <Badge className="rounded-full bg-primary text-primary-foreground">Best value</Badge>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">Pay once and save more across the year.</p>
              <ul className="mb-4 space-y-2">
                {YEARLY_PLAN_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                variant="outline"
                className="w-full border-primary/40 bg-background hover:bg-primary/10"
                disabled={isBillingLoading}
                onClick={() => handleStartCheckout("yearly")}
              >
                Continue with Yearly
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
