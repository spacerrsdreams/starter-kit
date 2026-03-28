import { create } from "zustand"

import type { CookieConsentStore } from "@/components/cookies/cookie-consent.types"

const COOKIE_CONSENT_STORAGE_KEY = "cookie-consent"

export const useCookieConsentStore = create<CookieConsentStore>((set) => ({
  consent: null,
  hydrated: false,
  hydrate: () => {
    const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)

    set({
      consent: storedConsent === "all" || storedConsent === "essential" ? storedConsent : null,
      hydrated: true,
    })
  },
  acceptAll: () => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "all")
    set({
      consent: "all",
    })
  },
  acceptNecessaryOnly: () => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "essential")
    set({
      consent: "essential",
    })
  },
}))
