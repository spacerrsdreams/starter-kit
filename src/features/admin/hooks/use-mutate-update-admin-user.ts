"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateAdminUserApi } from "@/features/admin/api/admin-users.api"
import { getAdminUsersQueryKey } from "@/features/admin/hooks/use-fetch-admin-users"
import type { AdminUserRole } from "@/features/admin/types/admin.types"

type UpdateAdminUserVariables = {
  userId: string
  email?: string
  role?: AdminUserRole
}

export function useMutateUpdateAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, ...body }: UpdateAdminUserVariables) => updateAdminUserApi(userId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: getAdminUsersQueryKey() })
    },
  })
}
