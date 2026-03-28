"use client"

import dynamic from "next/dynamic"

const CookieConsentBanner = dynamic(
  () => import("@/components/cookies/cookie-consent-banner.client").then((module) => module.CookieConsentBanner),
  { ssr: false }
)

export function CookieConsentBannerLazy() {
  return <CookieConsentBanner />
}
