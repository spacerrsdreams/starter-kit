export const ACCOUNT_DEACTIVATED = "ACCOUNT_DEACTIVATED"
export const UNKNOWN_ERROR_CODE = "UNKNOWN"

const SIGN_IN_ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  EMAIL_NOT_VERIFIED: "Email not verified",
  [ACCOUNT_DEACTIVATED]: "Your account is deactivated.",
}
export const ACCOUNT_DEACTIVATED_RESET_PASSWORD_MESSAGE =
  "Your account is deactivated. Sign in to reactivate your account."

export function getSignInErrorMessage(code: string): string {
  return SIGN_IN_ERROR_MESSAGES[code] ?? "An error occurred, please try again"
}

export function mapResetPasswordError(code: string): string {
  switch (code) {
    case "INVALID_TOKEN":
      return "Invalid reset token."
    case "TOKEN_EXPIRED":
      return "Reset token has expired."
    default:
      return "An error occurred, please try again."
  }
}
