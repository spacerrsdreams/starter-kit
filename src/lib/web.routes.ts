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
  dashboard: createRoute("Dashboard", "/dashboard"),
  pricing: createRoute("Pricing", "/pricing"),
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

export const headerPageLinks = [
  { title: "Home", href: WebRoutes.root.path },
  { title: "Dashboard", href: WebRoutes.dashboard.path },
  { title: "Contact", href: WebRoutes.contact.path },
  { title: "Pricing", href: WebRoutes.pricing.path },
] as const

export const headerCompanyLinks = [
  { title: "Terms and Conditions", href: WebRoutes.termsOfService.path },
  { title: "Privacy Policy", href: WebRoutes.privacyPolicy.path },
] as const

export const headerMenuLinks = [...headerPageLinks, ...headerCompanyLinks] as const

function normalizePathname(pathname: string): string {
  const normalizedPath = pathname.replace(/\/+$/, "")

  if (!normalizedPath) {
    return "/"
  }

  return normalizedPath
}

export function isDashboardPath(pathname: string): boolean {
  const normalizedPathname = normalizePathname(pathname)
  const dashboardPath = WebRoutes.dashboard.path

  return normalizedPathname === dashboardPath || normalizedPathname.startsWith(`${dashboardPath}/`)
}
