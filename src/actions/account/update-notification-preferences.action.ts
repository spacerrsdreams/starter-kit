"use server"

import "server-only"

import { headers } from "next/headers"

import { auth } from "@/lib/auth/auth"
import { updateAccountNotificationPreferences } from "@/lib/repositories/account-notification-preferences.repository"
import {
  updateNotificationPreferencesSchema,
  type UpdateNotificationPreferencesInput,
} from "@/features/settings/schemas/notification-preferences.schema"

type UpdateNotificationPreferencesActionResult =
  | {
      ok: true
      data: {
        notificationsEmailMarketing: boolean
        notificationsEmailPersonalized: boolean
      }
    }
  | { ok: false; code: "UNAUTHORIZED" | "INVALID_INPUT" | "NOT_FOUND" }

export async function updateNotificationPreferencesAction(
  input: UpdateNotificationPreferencesInput
): Promise<UpdateNotificationPreferencesActionResult> {
  const parsed = updateNotificationPreferencesSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, code: "INVALID_INPUT" }
  }

  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session?.user?.id) {
    return { ok: false, code: "UNAUTHORIZED" }
  }

  const updated = await updateAccountNotificationPreferences(session.user.id, parsed.data)

  if (!updated) {
    return { ok: false, code: "NOT_FOUND" }
  }

  return { ok: true, data: updated }
}
