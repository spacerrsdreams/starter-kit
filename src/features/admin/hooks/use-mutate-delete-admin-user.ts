"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteAdminUserApi } from "@/features/admin/api/admin-users.api"
import { adminQueryKeys } from "@/features/admin/constants/admin-query-keys"

export function useMutateDeleteAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdminUserApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() })
    },
  })
}
