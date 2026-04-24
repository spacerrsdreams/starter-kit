"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authClient } from "@/features/auth/lib/auth-client"
import { updateNotificationPreferencesAction } from "@/features/settings/actions/update-notification-preferences.action"
import { settingsQueryKeys } from "@/features/settings/constants/settings-query-keys"
import type {
  NotificationPreferences,
  UpdateNotificationPreferencesInput,
} from "@/features/settings/schemas/notification-preferences.schema"

export function useMutateNotificationPreferences() {
  const queryClient = useQueryClient()
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  return useMutation({
    mutationFn: async (patch: UpdateNotificationPreferencesInput) => {
      if (isSessionPending || !session?.user) {
        throw new Error("Authentication required")
      }
      return updateNotificationPreferencesAction(patch)
    },
    onMutate: async (patch) => {
      await queryClient.cancelQueries({
        queryKey: settingsQueryKeys.accountNotificationPreferences,
      })

      const previous = queryClient.getQueryData<NotificationPreferences>(
        settingsQueryKeys.accountNotificationPreferences
      )

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
