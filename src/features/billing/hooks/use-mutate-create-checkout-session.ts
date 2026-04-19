"use client"

import { useMutation } from "@tanstack/react-query"

import { authClient } from "@/lib/auth/auth-client"
import { createCheckoutSessionApi } from "@/features/billing/api/billing.api"
import type { CreateCheckoutSessionRequest } from "@/features/billing/types/billing-api.types"

export function useMutateCreateCheckoutSession() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  return useMutation({
    mutationFn: async (payload: CreateCheckoutSessionRequest) => {
      if (isSessionPending || !session?.user) {
        throw new Error("Authentication required")
      }
      return createCheckoutSessionApi(payload)
    },
  })
}
