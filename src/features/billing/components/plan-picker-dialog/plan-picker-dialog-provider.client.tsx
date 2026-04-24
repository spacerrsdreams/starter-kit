"use client"

import { useCallback, useMemo, useState } from "react"

import { PlanPickerDialogContext } from "@/features/billing/components/plan-picker-dialog/plan-picker-dialog-context"
import { PlanPickerDialog } from "@/features/billing/components/plan-picker-dialog/plan-picker-dialog.client"
import { BILLING_TRACKING_EVENTS } from "@/features/billing/constants/billing-tracking.constants"
import { useMutateCreateCheckoutSession } from "@/features/billing/hooks/use-mutate-create-checkout-session"
import { trackBillingEvent } from "@/features/billing/utils/track-billing-event.client"

type PlanPickerDialogProviderProps = {
  children: React.ReactNode
}

export function PlanPickerDialogProvider({ children }: PlanPickerDialogProviderProps) {
  const [open, setOpen] = useState(false)
  const checkoutSessionMutation = useMutateCreateCheckoutSession()

  const openPlanPickerDialog = useCallback(() => {
    setOpen(true)
  }, [])

  const closePlanPickerDialog = useCallback(() => {
    setOpen(false)
  }, [])

  const handleSelectProduct = useCallback(
    (selectedPlan: "monthly" | "yearly") => {
      void (async () => {
        try {
          const response = await checkoutSessionMutation.mutateAsync({ interval: selectedPlan })
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
    },
    [checkoutSessionMutation]
  )

  const contextValue = useMemo(
    () => ({
      openPlanPickerDialog,
      closePlanPickerDialog,
      isPlanPickerCheckoutLoading: checkoutSessionMutation.isPending,
    }),
    [checkoutSessionMutation.isPending, closePlanPickerDialog, openPlanPickerDialog]
  )

  return (
    <PlanPickerDialogContext.Provider value={contextValue}>
      {children}
      <PlanPickerDialog
        open={open}
        onOpenChange={setOpen}
        isBillingLoading={checkoutSessionMutation.isPending}
        onProductSelect={handleSelectProduct}
      />
    </PlanPickerDialogContext.Provider>
  )
}
