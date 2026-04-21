import { Route } from "next"

export const baseUrl = process.env.NEXT_PUBLIC_DOMAIN!

type RouteDefinition = {
  label: string
  path: Route
  withBaseUrl: () => string
}

type DynamicRouteDefinition<T extends string> = {
  label: string
  pattern: string
  withBaseUrl: (param: T) => string;
  (param: T): Route
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

function createDynamicRoute<T extends string>(
  label: string,
  pattern: string,
  createPath: (param: T) => string
): DynamicRouteDefinition<T> {
  const routeFn = ((param: T) => createPath(param) as Route) as DynamicRouteDefinition<T>
  routeFn.label = label
  routeFn.pattern = pattern
  routeFn.withBaseUrl = (param: T) => {
    const path = createPath(param)
    if (!baseUrl) {
      return path
    }

    return `${baseUrl.replace(/\/$/, "")}${path}`
  }

  return routeFn
}

export const WebRoutes = {
  root: createRoute("Home", "/"),
  search: createRoute("Search", "/search"),
  dashboard: createRoute("Dashboard", "/dashboard"),
  chat: createDynamicRoute("Chat", "/dashboard/ai/:id", (chatId) => `/dashboard/ai/${chatId}`),
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
