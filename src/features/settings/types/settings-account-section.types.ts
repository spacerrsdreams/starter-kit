import type { User } from "@/generated/prisma/browser"

export type SettingsAccountSessionUser = Pick<User, "email" | "emailVerified">
export type SendEmailVerificationActionErrorCode = "UNAUTHORIZED" | "INVALID_INPUT" | "RATE_LIMITED" | "FAILED"
