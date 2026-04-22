import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"

type StructuredDataProps = {
  description?: string
  applicationCategory?: string
  price?: string
  priceCurrency?: string
}

function escapeJsonLd(value: string): string {
  return value.replace(/</g, "\\u003c")
}

export function StructuredData({
  description = SiteConfig.description,
  applicationCategory = "HealthApplication",
  price = "0",
  priceCurrency = "USD",
}: StructuredDataProps) {
  const siteHomeUrl = WebRoutes.root.withBaseUrl()

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SiteConfig.name,
    url: siteHomeUrl,
    description,
    sameAs: [SiteConfig.authorUrl],
  }

  const webApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SiteConfig.name,
    description,
    url: siteHomeUrl,
    applicationCategory,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price,
      priceCurrency,
    },
  }

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SiteConfig.name,
    description,
    applicationCategory,
    operatingSystem: "Web",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLd(JSON.stringify(organization)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLd(JSON.stringify(webApplication)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLd(JSON.stringify(softwareApplication)),
        }}
      />
    </>
  )
}
