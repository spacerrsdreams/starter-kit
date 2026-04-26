const NEXT_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
const NEXT_PUBLIC_SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME
const NEXT_PUBLIC_ANALYTICS_TRACKING = process.env.NEXT_PUBLIC_ANALYTICS_TRACKING
const NEXT_PUBLIC_POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const NEXT_PUBLIC_POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST

const missingRequiredClientEnvKeys = [
  !NEXT_PUBLIC_DOMAIN ? "NEXT_PUBLIC_DOMAIN" : null,
  !NEXT_PUBLIC_SITE_NAME ? "NEXT_PUBLIC_SITE_NAME" : null,
].filter((value): value is string => value !== null)

if (missingRequiredClientEnvKeys.length > 0) {
  throw new Error(`[ClientEnv] Missing required env keys: ${missingRequiredClientEnvKeys.join(", ")}`)
}

export const ClientEnv = {
  NEXT_PUBLIC_DOMAIN: NEXT_PUBLIC_DOMAIN!,
  NEXT_PUBLIC_SITE_NAME: NEXT_PUBLIC_SITE_NAME!,
  NEXT_PUBLIC_ANALYTICS_TRACKING,
  NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST,
} as const
