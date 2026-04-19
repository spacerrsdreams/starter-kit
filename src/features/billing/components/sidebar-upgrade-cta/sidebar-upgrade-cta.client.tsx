"use client"

import { usePlanPickerDialog } from "@/features/billing/components/plan-picker-dialog/plan-picker-dialog-context"
import { BILLING_TRACKING_EVENTS } from "@/features/billing/constants/billing-tracking.constants"
import { useFetchBillingSubscription } from "@/features/billing/hooks/use-fetch-billing-subscription"
import { useMutateCreatePortalSession } from "@/features/billing/hooks/use-mutate-create-portal-session"
import { trackBillingEvent } from "@/features/billing/utils/track-billing-event.client"
import { Button } from "@/components/ui/button"
import { LogoSvg } from "@/components/ui/icons/logo.icon"

export function SidebarUpgradeCta() {
  const planPickerDialog = usePlanPickerDialog()
  const subscriptionQuery = useFetchBillingSubscription()
  const portalSessionMutation = useMutateCreatePortalSession()

  const isPaid = subscriptionQuery.data?.isPaid ?? false
  const isLoading = portalSessionMutation.isPending
  const ctaLabel = isPaid ? "Manage Pro plan" : "Get started"
  const currentPlan = isPaid ? "pro" : "free"

  const handleUpgradeClick = () => {
    trackBillingEvent({
      type: BILLING_TRACKING_EVENTS.ctaClicked,
      source: "sidebar_upgrade_cta",
      plan: currentPlan,
    })

    if (isPaid) {
      void (async () => {
        try {
          const response = await portalSessionMutation.mutateAsync()
          trackBillingEvent({
            type: BILLING_TRACKING_EVENTS.portalRedirected,
            source: "sidebar_upgrade_cta",
            plan: currentPlan,
          })
          window.location.href = response.portalUrl
        } catch {
          trackBillingEvent({
            type: BILLING_TRACKING_EVENTS.ctaFailed,
            source: "sidebar_upgrade_cta",
            plan: currentPlan,
          })
          return
        }
      })()
      return
    }

    planPickerDialog?.openPlanPickerDialog()
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-start border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:text-amber-950"
      disabled={isLoading || planPickerDialog?.isPlanPickerCheckoutLoading}
      onClick={handleUpgradeClick}
    >
      <LogoSvg className="mr-2 h-4 w-4 text-amber-500" />
      {isLoading ? "Opening..." : ctaLabel}
    </Button>
  )
}
