"use client"

import { useEffect } from "react"
import { useShallow } from "zustand/react/shallow"

import { useCookieConsentStore } from "@/components/cookies/cookie-consent.store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const COOKIE_CONSENT_STORAGE_KEY = "cookie-consent"
export const COOKIE_CONSENT_TOAST_ID = "cookie-consent-toast"

export function CookieConsentBanner() {
  const { consent, hydrated, hydrate, acceptAll, acceptNecessaryOnly } = useCookieConsentStore(
    useShallow((state) => ({
      consent: state.consent,
      hydrated: state.hydrated,
      hydrate: state.hydrate,
      acceptAll: state.acceptAll,
      acceptNecessaryOnly: state.acceptNecessaryOnly,
    }))
  )

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!hydrated || consent !== null) {
    return null
  }

  return (
    <Card
      role="dialog"
      aria-label="Cookie consent"
      className="fixed right-0 bottom-4 left-auto z-100 hidden w-80 pb-2 sm:block md:right-4"
    >
      <CardContent className="space-y-2 pb-0">
        <h5 className="text-xs leading-relaxed text-foreground">We use cookies to improve your experience.</h5>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={acceptAll} variant="default" className="text-xs">
            Accept all
          </Button>
          <Button type="button" size="sm" onClick={acceptNecessaryOnly} variant="outline" className="text-xs">
            Necessary only
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
