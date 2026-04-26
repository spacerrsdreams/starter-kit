import type { User } from "@/generated/prisma/browser"
import type { LucideIcon } from "lucide-react"

export type SettingsSectionId = "profile" | "account" | "notifications" | "appearance" | "legal"

export type SettingsMobileView = "list" | "section"

export type SettingsAccountSessionUser = Pick<User, "email" | "emailVerified"> & {
  twoFactorEnabled?: boolean
}
export type SendEmailVerificationActionErrorCode = "UNAUTHORIZED" | "INVALID_INPUT" | "RATE_LIMITED" | "FAILED"

export type SettingsNavItem = {
  id: SettingsSectionId
  label: string
  icon: LucideIcon
  requiresAuth?: boolean
}
