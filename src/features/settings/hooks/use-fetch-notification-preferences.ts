"use client"

import { getNotificationPreferencesAction } from "@/features/settings/actions/get-notification-preferences.action"
import { useQuery } from "@tanstack/react-query"

import { authClient } from "@/features/auth/lib/auth-client"
import { settingsQueryKeys } from "@/features/settings/constants/settings-query-keys"

export function useFetchNotificationPreferences() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)

  return useQuery({
    queryKey: settingsQueryKeys.accountNotificationPreferences,
    queryFn: async () => {
      const result = await getNotificationPreferencesAction()

      if (!result.ok) {
        throw new Error(result.code)
      }

      return result.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !isSessionPending && isAuthenticated,
  })
}
