"use client"

import { useMutation } from "@tanstack/react-query"

import { authClient } from "@/lib/auth/auth-client"

export function useMutateImpersonateAdminUser() {
  return useMutation({
    mutationFn: async (userId: string) => authClient.admin.impersonateUser({ userId }),
  })
}
