"use client"

import { useQuery } from "@tanstack/react-query"

import { getNotificationPreferencesAction } from "@/actions/account/get-notification-preferences.action"
import { settingsQueryKeys } from "@/features/settings/constants/settings-query-keys"

export function useFetchNotificationPreferences() {
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
  })
}
