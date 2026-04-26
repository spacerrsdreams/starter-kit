"use client"

import { useQuery } from "@tanstack/react-query"

import { authClient } from "@/features/auth/lib/auth-client"
import { getBillingSubscriptionApi } from "@/features/billing/api/billing.api"

export const billingSubscriptionQueryKey = "billing.subscription"

export const getBillingSubscriptionQueryKey = () => [billingSubscriptionQueryKey] as const

export function useFetchBillingSubscription() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)

  return useQuery({
    queryKey: getBillingSubscriptionQueryKey(),
    queryFn: getBillingSubscriptionApi,
    enabled: !isSessionPending && isAuthenticated,
  })
}
