import { z } from "zod"

export const notificationPreferencesSchema = z.object({
  notificationsEmailMarketing: z.boolean(),
  notificationsEmailPersonalized: z.boolean(),
})

export const updateNotificationPreferencesSchema = notificationPreferencesSchema.partial().refine((value) => {
  return (
    typeof value.notificationsEmailMarketing === "boolean" || typeof value.notificationsEmailPersonalized === "boolean"
  )
})

export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>
export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>
