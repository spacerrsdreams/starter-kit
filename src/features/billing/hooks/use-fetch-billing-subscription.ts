"use client"

import { useQuery } from "@tanstack/react-query"

import { authClient } from "@/features/auth/lib/auth-client"
import { getBillingSubscriptionApi } from "@/features/billing/api/billing.api"
import { billingQueryKeys } from "@/features/billing/constants/billing-query-keys"

export function useFetchBillingSubscription() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)

  return useQuery({
    queryKey: billingQueryKeys.subscription,
    queryFn: getBillingSubscriptionApi,
    enabled: !isSessionPending && isAuthenticated,
  })
}
