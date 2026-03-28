import type { Metadata } from "next"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { SeoPageJsonLd } from "@/components/seo/seo-page-json-ld"
import { LogoIcon } from "@/components/ui/icons/logo"

const title = "Home Dashboard"
const description = "Manage your workspace, jump into Ask AI, and navigate your " + SiteConfig.name + " dashboard."
const canonical = WebRoutes.root.withBaseUrl()

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

export default function DashboardPage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <SeoPageJsonLd name={title} description={description} url={canonical} />
      <div className="flex flex-col items-center gap-2">
        <LogoIcon />
        <h1 className="text-2xl font-bold">{SiteConfig.name}</h1>
      </div>
    </div>
  )
}
