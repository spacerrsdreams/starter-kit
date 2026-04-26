import "@/app/globals.css"
import "lenis/dist/lenis.css"

import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { DM_Sans } from "next/font/google"
import { Suspense } from "react"

import { ServerEnv } from "@/lib/env.server"
import { SiteConfig } from "@/lib/site.config"
import { cn } from "@/lib/utils"
import { AuthRequiredModalProvider } from "@/features/auth/components/auth-required-modal/auth-required-modal-provider"
import { UserActivityTracker } from "@/features/auth/components/user-activity-tracker"
import { createMetadata } from "@/features/seo/metadata"
import { CookieConsentBannerLazy } from "@/components/cookies/cookie-consent-banner-lazy"
import { QuickAccessMenuLazy } from "@/components/quick-access-menu/quick-access-menu-lazy"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PostHogProvider } from "@/providers/posthog.provider"
import { QueryClientProviderWrapper } from "@/providers/query-client.provider"
import { SmoothScrollProvider } from "@/providers/smooth-scroll.provider"
import { ThemeProvider } from "@/providers/theme.provider"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})

export const metadata = createMetadata({
  baseUrl: ServerEnv.NEXT_PUBLIC_DOMAIN,
  manifest: "/site.webmanifest",
  title: {
    default: SiteConfig.name,
    template: `%s | ${SiteConfig.name}`,
  },
  description: SiteConfig.description,
  keywords: SiteConfig.keywords,
  authors: [
    {
      name: SiteConfig.author,
      url: SiteConfig.authorUrl,
    },
  ],
  creator: SiteConfig.creator,
  publisher: SiteConfig.name,
  alternates: {
    canonical: ServerEnv.NEXT_PUBLIC_DOMAIN,
    languages: {
      en: ServerEnv.NEXT_PUBLIC_DOMAIN,
      "x-default": ServerEnv.NEXT_PUBLIC_DOMAIN,
    },
    types: {
      "application/rss+xml": `${ServerEnv.NEXT_PUBLIC_DOMAIN}/rss.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: ServerEnv.NEXT_PUBLIC_DOMAIN,
    title: SiteConfig.ogTitle,
    description: SiteConfig.ogDescription,
    siteName: SiteConfig.name,
    images: [
      {
        url: `${ServerEnv.NEXT_PUBLIC_DOMAIN}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: SiteConfig.name,
        type: "image/png",
      },
      {
        url: `${ServerEnv.NEXT_PUBLIC_DOMAIN}/opengraph-image-square.png`,
        width: 600,
        height: 600,
        alt: SiteConfig.name,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SiteConfig.ogTitle,
    description: SiteConfig.ogDescription,
    images: [`${ServerEnv.NEXT_PUBLIC_DOMAIN}/opengraph-image.png`],
    creator: SiteConfig.twitterCreator,
    site: SiteConfig.twitterCreator,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-16x16.png",
    apple: [
      { url: "/apple-touch-icon.png" },
      { url: "/apple-touch-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const messages = await getMessages()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans antialiased", dmSans.variable)}
      data-scroll-behavior="smooth"
    >
      <body>
        <Suspense fallback={null}>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
              <SmoothScrollProvider>
                <QueryClientProviderWrapper>
                  <PostHogProvider>
                    <AuthRequiredModalProvider>
                      <TooltipProvider>
                        {children}
                        <UserActivityTracker />

                        <QuickAccessMenuLazy renderInlineTrigger={false} />
                        <Toaster position="bottom-right" />
                        <CookieConsentBannerLazy />
                      </TooltipProvider>
                    </AuthRequiredModalProvider>
                  </PostHogProvider>
                </QueryClientProviderWrapper>
              </SmoothScrollProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  )
}
