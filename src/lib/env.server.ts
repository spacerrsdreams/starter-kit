import "server-only"

const requiredServerEnvKeys = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_PASSKEY_RP_ID",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "SUPPORT_EMAIL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_ID_PRO_MONTHLY",
  "STRIPE_PRICE_ID_PRO_YEARLY",
  "NEXT_PUBLIC_DOMAIN",
  "NEXT_PUBLIC_SITE_NAME",
] as const

type RequiredServerEnvKey = (typeof requiredServerEnvKeys)[number]

function getMissingRequiredServerEnvKeys(): RequiredServerEnvKey[] {
  return requiredServerEnvKeys.filter((key) => {
    const value = process.env[key]
    return typeof value !== "string" || value.length === 0
  })
}

const missingRequiredServerEnvKeys = getMissingRequiredServerEnvKeys()

if (missingRequiredServerEnvKeys.length > 0) {
  throw new Error(`[ServerEnv] Missing required env keys: ${missingRequiredServerEnvKeys.join(", ")}`)
}

export const ServerEnv = {
  DATABASE_URL: process.env.DATABASE_URL!,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
  BETTER_AUTH_PASSKEY_RP_ID: process.env.BETTER_AUTH_PASSKEY_RP_ID!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL!,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL!,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  STRIPE_PRICE_ID_PRO_MONTHLY: process.env.STRIPE_PRICE_ID_PRO_MONTHLY!,
  STRIPE_PRICE_ID_PRO_YEARLY: process.env.STRIPE_PRICE_ID_PRO_YEARLY!,
  NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN!,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME!,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_ANALYTICS_TRACKING: process.env.NEXT_PUBLIC_ANALYTICS_TRACKING,
} as const
