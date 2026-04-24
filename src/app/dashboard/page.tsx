import type { Metadata } from "next"
import { Suspense } from "react"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { Chat } from "@/features/ai/chat/components/chat"
import { ChatSessionSkeleton } from "@/features/ai/chat/components/chat-session/chat-session-skeleton"
import { BillingCheckoutStatusDialog } from "@/features/billing/components/billing-checkout-status-dialog.client"
import { SeoPageJsonLd } from "@/components/seo/seo-page-json-ld"

const title = "Ask AI"
const description = "Chat with AI, keep conversation history, and continue your work from one place."
const canonical = WebRoutes.dashboard.withBaseUrl()

export const metadata: Metadata = {
  title,
  description,
  keywords: SiteConfig.keywords,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical,
    languages: {
      en: canonical,
      "x-default": canonical,
    },
  },
  openGraph: {
    title,
    description,
    url: canonical,
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
}

export default function DashboardPage() {
  return (
    <>
      <SeoPageJsonLd name={title} description={description} url={canonical} />
      <Suspense
        fallback={
          <div className="flex h-[calc(100dvh-57px-4.5rem)] min-h-0 md:h-[calc(100dvh-57px)]">
            <main className="mx-auto flex min-h-0 max-w-3xl flex-1 flex-col">
              <ChatSessionSkeleton />
            </main>
          </div>
        }
      >
        <BillingCheckoutStatusDialog />
        <Chat />
      </Suspense>
    </>
  )
}
