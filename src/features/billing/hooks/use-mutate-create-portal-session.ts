"use client"

import { useMutation } from "@tanstack/react-query"

import { authClient } from "@/features/auth/lib/auth-client"
import { createPortalSessionApi } from "@/features/billing/api/billing.api"

export function useMutateCreatePortalSession() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  return useMutation({
    mutationFn: async () => {
      if (isSessionPending || !session?.user) {
        throw new Error("Authentication required")
      }
      return createPortalSessionApi()
    },
  })
}
