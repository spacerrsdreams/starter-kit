"use client"

import { useQuery } from "@tanstack/react-query"

import { listAdminUsersApi } from "@/features/admin/api/admin-users.api"
import { adminQueryKeys } from "@/features/admin/constants/admin-query-keys"
import { authClient } from "@/features/auth/lib/auth-client"

export function useFetchAdminUsers() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAdmin = session?.user?.role === "admin"

  return useQuery({
    queryKey: adminQueryKeys.users(),
    queryFn: listAdminUsersApi,
    enabled: !isSessionPending && isAdmin,
  })
}
