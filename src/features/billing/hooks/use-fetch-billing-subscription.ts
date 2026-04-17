"use client"

import { useQuery } from "@tanstack/react-query"

import { getBillingSubscriptionApi } from "@/features/billing/api/billing.api"
import { billingQueryKeys } from "@/features/billing/constants/billing-query-keys"

export function useFetchBillingSubscription(enabled = true) {
  return useQuery({
    queryKey: billingQueryKeys.subscription,
    queryFn: getBillingSubscriptionApi,
    enabled,
  })
}
