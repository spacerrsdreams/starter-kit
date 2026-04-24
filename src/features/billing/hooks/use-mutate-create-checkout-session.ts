"use client"

import { useMutation } from "@tanstack/react-query"

import { authClient } from "@/features/auth/lib/auth-client"
import { createCheckoutSessionApi } from "@/features/billing/api/billing.api"
import type { CreateCheckoutSessionRequest } from "@/features/billing/types/billing-api.types"

export function useMutateCreateCheckoutSession() {
  const { data: session, isPending } = authClient.useSession()

  return useMutation({
    mutationFn: async (payload: CreateCheckoutSessionRequest) => {
      if (isPending || !session?.user) {
        throw new Error("Authentication required")
      }

      return createCheckoutSessionApi(payload)
    },
  })
}
