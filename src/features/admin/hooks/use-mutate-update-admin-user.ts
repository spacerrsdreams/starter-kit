"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateAdminUserApi } from "@/features/admin/api/admin-users.api"
import { adminQueryKeys } from "@/features/admin/constants/admin-query-keys"

type UpdateAdminUserVariables = {
  userId: string
  email?: string
  role?: "user" | "admin"
}

export function useMutateUpdateAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, ...body }: UpdateAdminUserVariables) => updateAdminUserApi(userId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() })
    },
  })
}
