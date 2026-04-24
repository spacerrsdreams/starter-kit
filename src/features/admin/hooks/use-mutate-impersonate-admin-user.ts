"use client"

import { useMutation } from "@tanstack/react-query"

import { authClient } from "@/features/auth/lib/auth-client"

export function useMutateImpersonateAdminUser() {
  return useMutation({
    mutationFn: async (userId: string) => authClient.admin.impersonateUser({ userId }),
  })
}
