import { Metadata } from "next"

type SeoMetadataConfig = {
  baseUrl: string
  manifest: string
  title: {
    default: string
    template: string
  }
  description: string
  keywords: string[]
  authors: NonNullable<Metadata["authors"]>
  creator: string
  publisher: string
  alternates: {
    canonical: string
    languages: NonNullable<Metadata["alternates"]>["languages"]
    types: NonNullable<Metadata["alternates"]>["types"]
  }
  robots: {
    index: boolean
    follow: boolean
    nocache: boolean
    googleBot: {
      index: boolean
      follow: boolean
      noimageindex: boolean
      "max-video-preview": number
      "max-image-preview": "none" | "standard" | "large"
      "max-snippet": number
    }
  }
  openGraph: NonNullable<Metadata["openGraph"]>
  twitter: NonNullable<Metadata["twitter"]>
  icons: NonNullable<Metadata["icons"]>
}

export function createMetadata(config: SeoMetadataConfig): Metadata {
  return {
    metadataBase: new URL(config.baseUrl),
    manifest: config.manifest, // relative is correct here
    title: {
      default: config.title.default,
      template: config.title.template, // used by child pages: "About | MySite"
    },
    description: config.description,
    keywords: config.keywords,
    authors: config.authors,
    creator: config.creator,
    publisher: config.publisher,
    alternates: {
      canonical: config.alternates.canonical,
      languages: config.alternates.languages,
      types: config.alternates.types,
    },

    robots: {
      index: config.robots.index,
      follow: config.robots.follow,
      nocache: config.robots.nocache,
      googleBot: {
        index: config.robots.googleBot.index,
        follow: config.robots.googleBot.follow,
        noimageindex: config.robots.googleBot.noimageindex,
        "max-video-preview": config.robots.googleBot["max-video-preview"], // no limit
        "max-image-preview": config.robots.googleBot["max-image-preview"],
        "max-snippet": config.robots.googleBot["max-snippet"], // no limit
      },
    },

    openGraph: {
      ...config.openGraph,
      images: config.openGraph.images,
      // Optional: square fallback for platforms that prefer 1:1
    },

    // ─── Twitter / X ──────────────────────────────────────────
    twitter: {
      ...config.twitter,
      creator: config.twitter.creator, // e.g. "@yourhandle"
      site: config.twitter.site, // e.g. "@yoursitehandle"
    },

    icons: config.icons,
  }
}
