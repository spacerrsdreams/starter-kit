"use client"

import { getNotificationPreferencesAction } from "@/features/settings/actions/get-notification-preferences.action"
import { useQuery } from "@tanstack/react-query"

import { authClient } from "@/features/auth/lib/auth-client"

export const accountNotificationPreferencesQueryKey = "settings.account-notification-preferences"

export const getAccountNotificationPreferencesQueryKey = () => [accountNotificationPreferencesQueryKey] as const

export function useFetchNotificationPreferences() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)

  return useQuery({
    queryKey: getAccountNotificationPreferencesQueryKey(),
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
