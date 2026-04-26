"use client"

import { useQuery } from "@tanstack/react-query"

import { getBillingProductsApi } from "@/features/billing/api/billing.api"

export const billingProductsQueryKey = "billing.products"

export const getBillingProductsQueryKey = () => [billingProductsQueryKey] as const

export function useFetchBillingProducts() {
  return useQuery({
    queryKey: getBillingProductsQueryKey(),
    queryFn: getBillingProductsApi,
  })
}
