import { ApiRoutes } from "@/lib/api.routes"
import { WebRoutes } from "@/lib/web.routes"
import { getSafeNextFromSearchParams } from "@/features/auth/auth.utils"

export function buildPostAuthCallbackUrl(opts: {
  embedded: boolean
  pathname: string | null
  searchParams: URLSearchParams | null
  serverSafeNext?: string | null
}): string {
  if (opts.embedded) {
    const base = opts.pathname && opts.pathname.length > 0 ? opts.pathname : WebRoutes.root.path
    const pathWithSearch = base + (opts.searchParams?.toString() ? `?${opts.searchParams.toString()}` : "")

    return `${ApiRoutes.authSignedIn}?${new URLSearchParams({ next: pathWithSearch }).toString()}`
  }

  if (opts.serverSafeNext !== undefined) {
    if (opts.serverSafeNext) {
      return `${ApiRoutes.authSignedIn}?${new URLSearchParams({ next: opts.serverSafeNext }).toString()}`
    }

    return ApiRoutes.authSignedIn
  }

  const next = getSafeNextFromSearchParams(opts.searchParams)

  if (next) {
    return `${ApiRoutes.authSignedIn}?${new URLSearchParams({ next }).toString()}`
  }

  return ApiRoutes.authSignedIn
}
