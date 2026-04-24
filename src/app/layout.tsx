import "@/app/globals.css"
import "lenis/dist/lenis.css"

import { DM_Sans } from "next/font/google"
import { Suspense } from "react"

import { SiteConfig } from "@/lib/site.config"
import { cn } from "@/lib/utils"
import { AiWidgetLazy } from "@/features/ai/widget/components/ai-widget-lazy.client"
import { AuthRequiredModalProvider } from "@/features/auth/components/auth-required-modal/auth-required-modal-provider.client"
import { createMetadata } from "@/features/seo/metadata"
import { CookieConsentBannerLazy } from "@/components/cookies/cookie-consent-banner-lazy.client"
import { QuickAccessMenuLazy } from "@/components/quick-access-menu/quick-access-menu-lazy.client"
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

const BASE_URL = process.env.NEXT_PUBLIC_DOMAIN!

export const metadata = createMetadata({
  baseUrl: BASE_URL,
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
    canonical: BASE_URL,
    languages: {
      "en-US": `${BASE_URL}/en-US`,
    },
    types: {
      "application/rss+xml": `${BASE_URL}/rss.xml`,
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
    url: BASE_URL,
    title: SiteConfig.ogTitle,
    description: SiteConfig.ogDescription,
    siteName: SiteConfig.name,
    images: [
      {
        url: `${BASE_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: SiteConfig.name,
        type: "image/png",
      },
      {
        url: `${BASE_URL}/opengraph-image-square.png`,
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
    images: [`${BASE_URL}/opengraph-image.png`],
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
                <PostHogProvider>
                  <AuthRequiredModalProvider>
                    <TooltipProvider>
                      {children}
                      <AiWidgetLazy />
                      <QuickAccessMenuLazy renderInlineTrigger={false} />
                      <Toaster position="bottom-right" />
                      <CookieConsentBannerLazy />
                    </TooltipProvider>
                  </AuthRequiredModalProvider>
                </PostHogProvider>
              </QueryClientProviderWrapper>
            </SmoothScrollProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
