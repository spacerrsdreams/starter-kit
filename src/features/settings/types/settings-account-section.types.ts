export type SettingsAccountSessionUser = {
  email?: string | null
  emailVerified?: boolean
}

export type SendEmailVerificationActionErrorCode = "UNAUTHORIZED" | "INVALID_INPUT" | "RATE_LIMITED" | "FAILED"
