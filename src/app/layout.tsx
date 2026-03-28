import "@/app/globals.css"

import type { Metadata } from "next"
import { Nunito_Sans } from "next/font/google"

import { SiteConfig } from "@/lib/site.config"
import { cn } from "@/lib/utils"
import { CookieConsentBannerLazy } from "@/components/cookies/cookie-consent-banner-lazy.client"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClientProviderWrapper } from "@/providers/query-client.provider"
import { ThemeProvider } from "@/providers/theme.provider"

const fontSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "arial"],
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
    <html lang="en" suppressHydrationWarning className={cn("font-sans antialiased", fontSans.variable)}>
      <body>
        <ThemeProvider>
          <QueryClientProviderWrapper>
            <TooltipProvider>
              {children}
              <Toaster position="bottom-right" />
              <CookieConsentBannerLazy />
            </TooltipProvider>
          </QueryClientProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
