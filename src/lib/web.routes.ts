import { Route } from "next"

export const baseUrl = process.env.NEXT_PUBLIC_DOMAIN!

type RouteDefinition = {
  labelKey: string
  path: Route
  withBaseUrl: () => string
}

type DynamicRouteDefinition<T extends string> = {
  labelKey: string
  pattern: string
  withBaseUrl: (param: T) => string
  (param: T): Route
}

const DEFAULT_LOCALE = "en"
const LOCALE_PREFIXES = ["en", "ka"] as const

function normalizePathname(pathname: string): string {
  const normalizedPath = pathname.replace(/\/+$/, "")

  if (!normalizedPath) {
    return "/"
  }

  return normalizedPath
}

function getLocalePrefixFromPathname(pathname: string | null | undefined): `/${string}` | null {
  if (!pathname) {
    return null
  }

  const normalizedPathname = normalizePathname(pathname)
  const [firstSegment] = normalizedPathname.split("/").filter(Boolean)

  if (!firstSegment || !LOCALE_PREFIXES.includes(firstSegment as (typeof LOCALE_PREFIXES)[number])) {
    return null
  }

  return `/${firstSegment}`
}

function stripLocalePrefix(pathname: string): string {
  const normalizedPathname = normalizePathname(pathname)
  const localePrefix = getLocalePrefixFromPathname(normalizedPathname)

  if (!localePrefix) {
    return normalizedPathname
  }

  const withoutPrefix = normalizedPathname.slice(localePrefix.length)

  return withoutPrefix.length > 0 ? withoutPrefix : "/"
}

function getCurrentPathname(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  return window.location.pathname
}

function withLocalePrefix(path: string): Route {
  const pathname = getCurrentPathname()
  const localePrefix = getLocalePrefixFromPathname(pathname)

  if (!localePrefix || localePrefix === `/${DEFAULT_LOCALE}`) {
    return path as Route
  }

  if (path === "/") {
    return localePrefix as Route
  }

  return `${localePrefix}${path}` as Route
}

function createRoute(labelKey: string, path: string): RouteDefinition {
  return {
    labelKey,
    get path() {
      return withLocalePrefix(path)
    },
    withBaseUrl: () => {
      const localizedPath = withLocalePrefix(path)
      if (!baseUrl) {
        return localizedPath
      }

      return `${baseUrl.replace(/\/$/, "")}${localizedPath}`
    },
  }
}

function createDynamicRoute<T extends string>(
  labelKey: string,
  pattern: string,
  createPath: (param: T) => string
): DynamicRouteDefinition<T> {
  const routeFn = ((param: T) => withLocalePrefix(createPath(param))) as DynamicRouteDefinition<T>
  routeFn.labelKey = labelKey
  routeFn.pattern = pattern
  routeFn.withBaseUrl = (param: T) => {
    const localizedPath = routeFn(param)

    if (!baseUrl) {
      return localizedPath
    }

    return `${baseUrl.replace(/\/$/, "")}${localizedPath}`
  }

  return routeFn
}

export const WebRoutes = {
  root: createRoute("routes.home", "/"),
  search: createRoute("routes.search", "/search"),
  dashboard: createRoute("routes.dashboard", "/dashboard"),
  admin: createRoute("routes.admin", "/dashboard/admin"),
  chat: createDynamicRoute("routes.chat", "/dashboard/ai/:id", (chatId) => `/dashboard/ai/${chatId}`),
  pricing: createRoute("routes.pricing", "/pricing"),
  blog: createRoute("routes.blog", "/blog"),
  blogPost: createDynamicRoute("routes.blogPost", "/blog/:slug", (slug) => `/blog/${slug}`),
  editBlogPost: createDynamicRoute(
    "routes.editBlogPost",
    "/dashboard/admin/blog/:postId/edit",
    (postId) => `/dashboard/admin/blog/${postId}/edit`
  ),
  createBlogPost: createRoute("routes.createBlogPost", "/dashboard/admin/blog/create"),
  signIn: createRoute("routes.signIn", "/sign-in"),
  signUp: createRoute("routes.signUp", "/sign-up"),
  resetPassword: createRoute("routes.resetPassword", "/reset-password"),
  contact: createRoute("routes.contact", "/contact"),
  feedback: createRoute("routes.feedback", "/feedback"),
  verifyEmail: createRoute("routes.verifyEmail", "/verify-email"),
  emailUnsubscribe: createRoute("routes.emailPreferences", "/email-unsubscribe"),
  privacyPolicy: createRoute("routes.privacyPolicy", "/privacy-policy"),
  termsOfService: createRoute("routes.termsOfService", "/terms-of-service"),
} as const

export function getHeaderPageLinks() {
  return [
    { titleKey: "home.header.menu.dashboard", href: WebRoutes.dashboard.path },
    { titleKey: "home.header.menu.marketing", href: WebRoutes.root.path },
    { titleKey: "home.header.menu.blog", href: WebRoutes.blog.path },
    { titleKey: "home.header.pricing", href: WebRoutes.pricing.path },
  ] as const
}

export function getHeaderCompanyLinks() {
  return [
    { titleKey: "home.header.menu.contact", href: WebRoutes.contact.path },
    { titleKey: "home.header.menu.termsAndConditions", href: WebRoutes.termsOfService.path },
    { titleKey: "home.header.menu.privacyPolicy", href: WebRoutes.privacyPolicy.path },
  ] as const
}

export function getHeaderMenuLinks() {
  const headerPageLinks = getHeaderPageLinks()
  const headerCompanyLinks = getHeaderCompanyLinks()

  return [
    headerPageLinks[0],
    headerCompanyLinks[0],
    headerPageLinks[1],
    headerCompanyLinks[1],
    headerPageLinks[2],
    headerCompanyLinks[2],
    headerPageLinks[3],
  ] as const
}

export function isPathWithinRoute(pathname: string, routePath: Route): boolean {
  const normalizedPathname = stripLocalePrefix(pathname)
  const normalizedRoutePath = normalizePathname(routePath)

  return normalizedPathname === normalizedRoutePath || normalizedPathname.startsWith(`${normalizedRoutePath}/`)
}

export function isDashboardPath(pathname: string): boolean {
  return isPathWithinRoute(pathname, WebRoutes.dashboard.path)
}
