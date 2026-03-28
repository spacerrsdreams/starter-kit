"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateNotificationPreferencesAction } from "@/actions/account/update-notification-preferences.action"
import { settingsQueryKeys } from "@/features/settings/constants/settings-query-keys"
import type { NotificationPreferences } from "@/features/settings/schemas/notification-preferences.schema"

export function useMutateNotificationPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateNotificationPreferencesAction,
    onMutate: async (patch) => {
      await queryClient.cancelQueries({
        queryKey: settingsQueryKeys.accountNotificationPreferences,
      })

      const previous = queryClient.getQueryData<NotificationPreferences>(settingsQueryKeys.accountNotificationPreferences)

      if (previous) {
        queryClient.setQueryData(settingsQueryKeys.accountNotificationPreferences, {
          ...previous,
          ...patch,
        })
      }

      return { previous }
    },
    onError: (_error, _patch, context) => {
      if (context?.previous) {
        queryClient.setQueryData(settingsQueryKeys.accountNotificationPreferences, context.previous)
      }
    },
    onSuccess: (result) => {
      if (!result.ok) {
        return
      }

      queryClient.setQueryData(settingsQueryKeys.accountNotificationPreferences, result.data)
    },
  })
}
