import { Route } from "next"

export const baseUrl = process.env.NEXT_PUBLIC_DOMAIN!

type RouteDefinition = {
  label: string
  path: Route
  withBaseUrl: () => string
}

function createRoute(label: string, path: string): RouteDefinition {
  return {
    label,
    path: path as Route,
    withBaseUrl: () => {
      if (!baseUrl) {
        return path
      }

      return `${baseUrl.replace(/\/$/, "")}${path}`
    },
  }
}

export const WebRoutes = {
  root: createRoute("Home", "/"),
  search: createRoute("Search", "/search"),
  askAi: createRoute("Ask AI", "/ai"),
  inbox: createRoute("Inbox", "/inbox"),
  signIn: createRoute("Sign In", "/sign-in"),
  signUp: createRoute("Sign Up", "/sign-up"),
  resetPassword: createRoute("Reset Password", "/reset-password"),
  contact: createRoute("Contact", "/contact"),
  feedback: createRoute("Feedback", "/feedback"),
  verifyEmail: createRoute("Verify Email", "/verify-email"),
  emailUnsubscribe: createRoute("Email Preferences", "/email-unsubscribe"),
  privacyPolicy: createRoute("Privacy Policy", "/privacy-policy"),
  termsOfService: createRoute("Terms of Service", "/terms-of-service"),
} as const
