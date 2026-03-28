type SeoPageJsonLdProps = {
  name: string
  description: string
  url: string
}

export function SeoPageJsonLd({ name, description, url }: SeoPageJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
