"use client"

import { useQuery } from "@tanstack/react-query"

import { listAdminUsersApi } from "@/features/admin/api/admin-users.api"
import { authClient } from "@/features/auth/lib/auth-client"

export const adminUsersQueryKey = "admin.users"

export const getAdminUsersQueryKey = () => [adminUsersQueryKey] as const

export function useFetchAdminUsers() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAdmin = session?.user?.role === "admin"

  return useQuery({
    queryKey: getAdminUsersQueryKey(),
    queryFn: listAdminUsersApi,
    enabled: !isSessionPending && isAdmin,
  })
}
