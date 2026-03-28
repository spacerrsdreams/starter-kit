export type SignInErrorMessageKey = "invalidEmailOrPassword" | "errorGeneric"

export function getSignInErrorMessageKey(code: string): SignInErrorMessageKey {
  if (code === "INVALID_EMAIL_OR_PASSWORD") {
    return "invalidEmailOrPassword"
  }

  return "errorGeneric"
}
