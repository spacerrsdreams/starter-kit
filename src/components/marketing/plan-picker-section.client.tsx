"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useCallback, useEffect } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { PlanPicker } from "@/features/billing/components/plan-picker-dialog/plan-picker.client"
import { useMutateCreateCheckoutSession } from "@/features/billing/hooks/use-mutate-create-checkout-session"
import { SpinnerWithBackdrop } from "@/components/ui/spinner"

export function PlanPickerSectionClient() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const { openAuthModal } = useAuthRequiredModal()
  const checkoutSessionMutation = useMutateCreateCheckoutSession()

  const selectedPlanFromUrl = searchParams.get("checkoutInterval")
  const hasValidSelectedPlan = selectedPlanFromUrl === "monthly" || selectedPlanFromUrl === "yearly"

  const startCheckout = useCallback(
    async (selectedPlan: "monthly" | "yearly") => {
      try {
        const { checkoutUrl } = await checkoutSessionMutation.mutateAsync({ interval: selectedPlan })
        window.location.href = checkoutUrl
      } catch (error) {
        console.error("Failed to start checkout.", error)
      }
    },
    [checkoutSessionMutation]
  )

  const handleSelectProduct = useCallback(
    (selectedPlan: "monthly" | "yearly") => {
      if (isSessionPending) return

      if (!session?.user) {
        const redirectPath = `${pathname}?${new URLSearchParams({
          ...Object.fromEntries(searchParams),
          checkoutInterval: selectedPlan,
        })}`
        openAuthModal({ redirectPath })
        return
      }

      void startCheckout(selectedPlan)
    },
    [isSessionPending, session?.user, pathname, searchParams, openAuthModal, startCheckout]
  )

  useEffect(() => {
    if (!hasValidSelectedPlan || isSessionPending || !session?.user) return
    void startCheckout(selectedPlanFromUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasValidSelectedPlan, isSessionPending, selectedPlanFromUrl, session?.user])

  const isRedirecting =
    hasValidSelectedPlan && !isSessionPending && (session?.user ? checkoutSessionMutation.isPending : false)

  return (
    <section className="w-full px-4 py-0">
      {isRedirecting ? <SpinnerWithBackdrop label="Redirecting to checkout..." /> : null}
      <PlanPicker
        isBillingLoading={checkoutSessionMutation.isPending || isSessionPending}
        onProductSelect={handleSelectProduct}
      />
    </section>
  )
}
