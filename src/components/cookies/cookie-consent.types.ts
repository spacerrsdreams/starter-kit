export type CookieConsentValue = "all" | "essential"

export type CookieConsentStore = {
  consent: CookieConsentValue | null
  hydrated: boolean
  hydrate: () => void
  acceptAll: () => void
  acceptNecessaryOnly: () => void
}
