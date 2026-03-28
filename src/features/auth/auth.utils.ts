import { WebRoutes } from "@/lib/web.routes"

const BLOCKED_PREFIXES = ["/api/", "/_next/", "/_vercel"] as const

function isSafeInternalAppPath(path: string): boolean {
  const pathOnly = path.split("?")[0] ?? ""

  if (!pathOnly.startsWith("/") || pathOnly.includes("..") || pathOnly.includes("\\")) {
    return false
  }

  if (pathOnly.includes("//")) {
    return false
  }

  for (const prefix of BLOCKED_PREFIXES) {
    if (pathOnly.startsWith(prefix)) {
      return false
    }
  }

  const segments = pathOnly.split("/").filter(Boolean)

  if (segments.length === 0) {
    return false
  }

  const first = segments[0]

  if (first === WebRoutes.signIn.path.replaceAll("/", "") || first === WebRoutes.signUp.path.replaceAll("/", "")) {
    return false
  }

  return true
}

export function getSafeNextFromSearchParams(searchParams: URLSearchParams | null): string | null {
  const raw = searchParams?.get("next")

  if (!raw) {
    return null
  }

  try {
    const decoded = decodeURIComponent(raw)

    return isSafeInternalAppPath(decoded) ? decoded : null
  } catch {
    return null
  }
}

export function parseSafePostAuthRedirectUrl(nextParam: string | null, baseUrl: string): URL | null {
  if (!nextParam) {
    return null
  }

  let decoded: string

  try {
    decoded = decodeURIComponent(nextParam.trim())
  } catch {
    return null
  }

  if (!isSafeInternalAppPath(decoded)) {
    return null
  }

  try {
    const resolved = new URL(decoded, baseUrl)
    const base = new URL(baseUrl)

    if (resolved.origin !== base.origin) {
      return null
    }

    return resolved
  } catch {
    return null
  }
}
