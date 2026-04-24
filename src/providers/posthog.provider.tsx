"use client"

import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"
import type { ReactNode } from "react"
import { useEffect } from "react"

import { WebRoutes, isPathWithinRoute } from "@/lib/web.routes"

type PostHogProviderProps = {
  children: ReactNode
}

const ANALYTICS_TOGGLE = process.env.NEXT_PUBLIC_ANALYTICS_TRACKING
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST

function isAdminPath(pathname: string): boolean {
  return isPathWithinRoute(pathname, WebRoutes.admin.path)
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isAnalyticsEnabled = ANALYTICS_TOGGLE === "on" && Boolean(POSTHOG_KEY)

  useEffect(() => {
    if (!isAnalyticsEnabled || posthog.__loaded || !POSTHOG_KEY) {
      return
    }

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false,
    })
  }, [isAnalyticsEnabled])

  useEffect(() => {
    if (!isAnalyticsEnabled || !pathname || isAdminPath(pathname)) {
      return
    }

    const query = searchParams.toString()
    const url = query ? `${pathname}?${query}` : pathname

    posthog.capture("$pageview", {
      $current_url: url,
    })
  }, [isAnalyticsEnabled, pathname, searchParams])

  return children
}
