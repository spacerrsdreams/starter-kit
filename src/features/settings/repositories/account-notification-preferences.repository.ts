import "server-only"

import { prisma } from "@/lib/prisma"
import {
  notificationPreferencesSchema,
  type NotificationPreferences,
  type UpdateNotificationPreferencesInput,
} from "@/features/settings/schemas/notification-preferences.schema"

export async function getAccountNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      notificationsEmailMarketing: true,
      notificationsEmailPersonalized: true,
    },
  })

  if (!row) {
    return null
  }

  const parsed = notificationPreferencesSchema.safeParse(row)
  if (!parsed.success) {
    return null
  }

  return parsed.data
}

export async function updateAccountNotificationPreferences(
  userId: string,
  values: UpdateNotificationPreferencesInput
): Promise<NotificationPreferences | null> {
  if (
    typeof values.notificationsEmailMarketing !== "boolean" &&
    typeof values.notificationsEmailPersonalized !== "boolean"
  ) {
    return getAccountNotificationPreferences(userId)
  }

  const row = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(typeof values.notificationsEmailMarketing === "boolean"
        ? { notificationsEmailMarketing: values.notificationsEmailMarketing }
        : {}),
      ...(typeof values.notificationsEmailPersonalized === "boolean"
        ? { notificationsEmailPersonalized: values.notificationsEmailPersonalized }
        : {}),
    },
    select: {
      notificationsEmailMarketing: true,
      notificationsEmailPersonalized: true,
    },
  })
  if (!row) {
    return null
  }

  const parsed = notificationPreferencesSchema.safeParse(row)
  if (!parsed.success) {
    return null
  }

  return parsed.data
}
