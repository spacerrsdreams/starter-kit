"use client"

import { useMutation } from "@tanstack/react-query"

import { createCheckoutSessionApi } from "@/features/billing/api/billing.api"

export function useMutateCreateCheckoutSession() {
  return useMutation({
    mutationFn: createCheckoutSessionApi,
  })
}
