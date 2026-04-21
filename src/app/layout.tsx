import "@/app/globals.css"
import "lenis/dist/lenis.css"

import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Suspense } from "react"

import { SiteConfig } from "@/lib/site.config"
import { cn } from "@/lib/utils"
import { CookieConsentBannerLazy } from "@/components/cookies/cookie-consent-banner-lazy.client"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClientProviderWrapper } from "@/providers/query-client.provider"
import { SmoothScrollProvider } from "@/providers/smooth-scroll.provider"
import { ThemeProvider } from "@/providers/theme.provider"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: SiteConfig.name,
    template: "%s | " + SiteConfig.name,
  },
  description: SiteConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans antialiased", dmSans.variable)}
      data-scroll-behavior="smooth"
    >
      <body>
        <Suspense fallback={null}>
          <ThemeProvider>
            <SmoothScrollProvider>
              <QueryClientProviderWrapper>
                <TooltipProvider>
                  {children}
                  <Toaster position="bottom-right" />
                  <CookieConsentBannerLazy />
                </TooltipProvider>
              </QueryClientProviderWrapper>
            </SmoothScrollProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
