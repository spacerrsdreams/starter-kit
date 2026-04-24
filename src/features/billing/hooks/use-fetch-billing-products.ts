"use client"

import { useQuery } from "@tanstack/react-query"

import { getBillingProductsApi } from "@/features/billing/api/billing.api"
import { billingQueryKeys } from "@/features/billing/constants/billing-query-keys"

export function useFetchBillingProducts() {
  return useQuery({
    queryKey: billingQueryKeys.products,
    queryFn: getBillingProductsApi,
  })
}
