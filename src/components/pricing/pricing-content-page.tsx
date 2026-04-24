"use client"

import { useCallback } from "react"
import type { Route } from "next"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { ApiRoutes } from "@/lib/api.routes"
import { authClient } from "@/lib/auth/auth-client"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { PlanPicker } from "@/features/billing/components/plan-picker-dialog/plan-picker.client"
import { useMutateCreateCheckoutSession } from "@/features/billing/hooks/use-mutate-create-checkout-session"

export function PricingContentPage() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const { openAuthModal } = useAuthRequiredModal()
  const checkoutSessionMutation = useMutateCreateCheckoutSession()

  const handleSelectProduct = useCallback(
    (selectedProduct: "monthly" | "yearly") => {
      const nextSearchParams = new URLSearchParams(searchParams.toString())
      nextSearchParams.set("checkoutProduct", selectedProduct)
      const redirectPath = `${pathname}?${nextSearchParams.toString()}`
      const callbackURL = `${ApiRoutes.authSignedIn}?${new URLSearchParams({ next: redirectPath }).toString()}`

      if (isSessionPending || !session?.user) {
        openAuthModal({ redirectPath })
        return
      }

      void (async () => {
        try {
          const response = await checkoutSessionMutation.mutateAsync({ product: selectedProduct })
          window.location.href = response.checkoutUrl
        } catch (error) {
          console.error("Failed to start checkout from pricing page.", error)
          if (error instanceof Error && error.message === "Authentication required") {
            router.push(callbackURL as Route)
          }
        }
      })()
    },
    [checkoutSessionMutation, isSessionPending, openAuthModal, pathname, router, searchParams, session?.user]
  )

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-30 sm:px-6 md:py-45">
      <PlanPicker
        isBillingLoading={checkoutSessionMutation.isPending || isSessionPending}
        showMainlabel={false}
        onProductSelect={handleSelectProduct}
      />
    </main>
  )
}
