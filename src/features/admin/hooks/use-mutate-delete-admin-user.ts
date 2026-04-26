"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteAdminUserApi } from "@/features/admin/api/admin-users.api"
import { getAdminUsersQueryKey } from "@/features/admin/hooks/use-fetch-admin-users"

export function useMutateDeleteAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdminUserApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: getAdminUsersQueryKey() })
    },
  })
}
