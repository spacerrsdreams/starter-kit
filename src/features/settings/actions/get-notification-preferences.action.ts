"use server"

import "server-only"

import { headers } from "next/headers"

import { auth } from "@/features/auth/lib/auth"
import { getAccountNotificationPreferences } from "@/features/settings/repositories/account-notification-preferences.repository"

type GetNotificationPreferencesActionResult =
  | {
      ok: true
      data: {
        notificationsEmailMarketing: boolean
        notificationsEmailPersonalized: boolean
      }
    }
  | { ok: false; code: "UNAUTHORIZED" | "NOT_FOUND" }

export async function getNotificationPreferencesAction(): Promise<GetNotificationPreferencesActionResult> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session?.user?.id) {
    return { ok: false, code: "UNAUTHORIZED" }
  }

  const preferences = await getAccountNotificationPreferences(session.user.id)

  if (!preferences) {
    return { ok: false, code: "NOT_FOUND" }
  }

  return { ok: true, data: preferences }
}
