"use client"

import { useCallback, useEffect, useRef } from "react"
import type { Route } from "next"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { ApiRoutes } from "@/lib/api.routes"
import { authClient } from "@/lib/auth/auth-client"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { PlanPicker } from "@/features/billing/components/plan-picker-dialog/plan-picker.client"
import { useMutateCreateCheckoutSession } from "@/features/billing/hooks/use-mutate-create-checkout-session"

export function PlanPickerSectionClient() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const { openAuthModal } = useAuthRequiredModal()
  const checkoutSessionMutation = useMutateCreateCheckoutSession()
  const hasAutoStartedCheckoutRef = useRef(false)

  const handleSelectInterval = useCallback(
    (interval: "monthly" | "yearly") => {
      const nextSearchParams = new URLSearchParams(searchParams.toString())
      nextSearchParams.set("checkoutInterval", interval)
      const redirectPath = `${pathname}?${nextSearchParams.toString()}`
      const callbackURL = `${ApiRoutes.authSignedIn}?${new URLSearchParams({ next: redirectPath }).toString()}`

      if (isSessionPending || !session?.user) {
        openAuthModal({ redirectPath })
        return
      }

      void (async () => {
        try {
          const response = await checkoutSessionMutation.mutateAsync({ interval })
          window.location.href = response.checkoutUrl
        } catch (error) {
          console.error("Failed to start checkout from pricing section.", error)
          if (error instanceof Error && error.message === "Authentication required") {
            router.push(callbackURL as Route)
          }
        }
      })()
    },
    [checkoutSessionMutation, isSessionPending, openAuthModal, pathname, router, searchParams, session?.user]
  )

  useEffect(() => {
    const selectedInterval = searchParams.get("checkoutInterval")
    const isIntervalValid = selectedInterval === "monthly" || selectedInterval === "yearly"

    if (!isIntervalValid) {
      hasAutoStartedCheckoutRef.current = false
      return
    }

    if (isSessionPending || !session?.user || checkoutSessionMutation.isPending || hasAutoStartedCheckoutRef.current) {
      return
    }

    hasAutoStartedCheckoutRef.current = true

    void (async () => {
      try {
        const response = await checkoutSessionMutation.mutateAsync({ interval: selectedInterval })
        window.location.href = response.checkoutUrl
      } catch (error) {
        hasAutoStartedCheckoutRef.current = false
        console.error("Failed to auto-start checkout after authentication.", error)
      }
    })()
  }, [checkoutSessionMutation, isSessionPending, searchParams, session?.user])

  return (
    <section className="w-full px-4 py-0">
      <PlanPicker
        isBillingLoading={checkoutSessionMutation.isPending || isSessionPending}
        onSelectInterval={handleSelectInterval}
      />
    </section>
  )
}
