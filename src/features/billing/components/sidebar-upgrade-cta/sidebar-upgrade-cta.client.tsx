"use client"

import { SparklesIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth/auth-client"
import { WebRoutes } from "@/lib/web.routes"
import { BILLING_TRACKING_EVENTS } from "@/features/billing/constants/billing-tracking.constants"
import { useFetchBillingSubscription } from "@/features/billing/hooks/use-fetch-billing-subscription"
import { useMutateCreateCheckoutSession } from "@/features/billing/hooks/use-mutate-create-checkout-session"
import { useMutateCreatePortalSession } from "@/features/billing/hooks/use-mutate-create-portal-session"
import { trackBillingEvent } from "@/features/billing/utils/track-billing-event.client"
import { Button } from "@/components/ui/button"

export function SidebarUpgradeCta() {
  const router = useRouter()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)
  const subscriptionQuery = useFetchBillingSubscription(isAuthenticated && !isSessionPending)
  const checkoutSessionMutation = useMutateCreateCheckoutSession()
  const portalSessionMutation = useMutateCreatePortalSession()

  const isPaid = subscriptionQuery.data?.isPaid ?? false
  const isLoading = checkoutSessionMutation.isPending || portalSessionMutation.isPending
  const ctaLabel = isPaid ? "Manage Pro plan" : "Get started"
  const currentPlan = isPaid ? "pro" : "free"

  const handleUpgradeClick = () => {
    trackBillingEvent({
      type: BILLING_TRACKING_EVENTS.ctaClicked,
      source: "sidebar_upgrade_cta",
      plan: currentPlan,
    })

    if (!isAuthenticated) {
      router.push(WebRoutes.signIn.path)
      return
    }

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

    void (async () => {
      try {
        const response = await checkoutSessionMutation.mutateAsync({ interval: "monthly" })
        trackBillingEvent({
          type: BILLING_TRACKING_EVENTS.checkoutRedirected,
          source: "sidebar_upgrade_cta",
          plan: currentPlan,
        })
        window.location.href = response.checkoutUrl
      } catch {
        trackBillingEvent({
          type: BILLING_TRACKING_EVENTS.ctaFailed,
          source: "sidebar_upgrade_cta",
          plan: currentPlan,
        })
        return
      }
    })()
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-start border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:text-amber-950"
      disabled={isLoading}
      onClick={handleUpgradeClick}
    >
      <SparklesIcon className="text-amber-500" />
      {isLoading ? "Opening..." : ctaLabel}
    </Button>
  )
}
