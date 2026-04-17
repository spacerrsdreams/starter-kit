"use client"

import { useMutation } from "@tanstack/react-query"

import { createPortalSessionApi } from "@/features/billing/api/billing.api"

export function useMutateCreatePortalSession() {
  return useMutation({
    mutationFn: createPortalSessionApi,
  })
}
