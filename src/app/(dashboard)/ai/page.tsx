import type { Metadata } from "next"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { Chat } from "@/features/ai/chat/components/chat"
import { SeoPageJsonLd } from "@/components/seo/seo-page-json-ld"

const title = "Ask AI"
const description = "Chat with AI, keep conversation history, and continue your work from one place."
const canonical = WebRoutes.askAi.withBaseUrl()

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

export default function AiPage() {
  return (
    <>
      <SeoPageJsonLd name={title} description={description} url={canonical} />
      <Chat />
    </>
  )
}
