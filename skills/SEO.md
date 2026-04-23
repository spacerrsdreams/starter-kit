## SEO Skill — Next.js App Router (TypeScript)

> **Scope:** Every page, route, and file that affects how search engines and social platforms discover, index, and display this project.
> **Stack:** Next.js App Router · TypeScript · Tailwind CSS
> **Reference repos:** [ixartz/Next-js-Boilerplate](https://github.com/ixartz/Next-js-Boilerplate) · [ixartz/SaaS-Boilerplate](https://github.com/ixartz/SaaS-Boilerplate)

---

### 1. Core Principles

- Every page **must** have a unique `<title>` and `<meta description>`.
- Never duplicate metadata across routes — use `generateMetadata` for dynamic pages.
- Canonical URLs must always be explicit — never rely on defaults.
- `robots` directives must be set globally in `layout.tsx` and overridden per-page where needed.
- Structured data (JSON-LD) must be added to every page that qualifies for rich results.
- OG images must be 1200x630px. Never use a placeholder or missing image.
- Sitemap and robots.txt must be generated via Next.js native file conventions (`sitemap.ts`, `robots.ts`).
- Performance IS SEO: use `next/image`, `next/font`, static generation by default, and minimize CLS/LCP.

---

### 2. Root Layout Metadata (`app/layout.tsx`)

This is the **global baseline**. All child pages inherit and can override.

```typescript
// app/layout.tsx
import type { Metadata } from "next"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN!),

  // Title template: child pages render as "About | MySite"
  title: {
    default: SiteConfig.name,
    template: `%s | ${SiteConfig.name}`,
  },
  description: SiteConfig.description,
  keywords: SiteConfig.keywords,
  authors: [{ name: SiteConfig.author, url: SiteConfig.authorUrl }],
  creator: SiteConfig.creator,
  publisher: SiteConfig.name,

  // Canonical + alternates
  alternates: {
    canonical: WebRoutes.root.withBaseUrl(),
    // Only add `languages` if the app supports i18n
    // languages: { "en-US": `${process.env.NEXT_PUBLIC_DOMAIN}/en-US` },
    types: {
      "application/rss+xml": `${process.env.NEXT_PUBLIC_DOMAIN}/rss.xml`,
    },
  },

  // Robots — explicit is always better than implicit
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

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: WebRoutes.root.withBaseUrl(),
    title: SiteConfig.ogTitle,
    description: SiteConfig.ogDescription,
    siteName: SiteConfig.name,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: SiteConfig.name,
        type: "image/png",
      },
      // Square fallback for platforms that prefer 1:1
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/opengraph-image-square.png`,
        width: 600,
        height: 600,
        alt: SiteConfig.name,
        type: "image/png",
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: SiteConfig.ogTitle,
    description: SiteConfig.ogDescription,
    images: [`${process.env.NEXT_PUBLIC_DOMAIN}/opengraph-image.png`],
    creator: SiteConfig.twitterCreator, // e.g. "@yourhandle"
    site: SiteConfig.twitterSite, // e.g. "@yoursitehandle"
  },

  // Icons — provide all sizes for full platform coverage
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
        // @ts-expect-error - not in Next.js types but used by browsers
        color: SiteConfig.themeColor,
      },
    ],
  },

  // PWA manifest — use relative path, metadataBase handles the domain
  manifest: "/site.webmanifest",

  // Theme color & browser UI
  other: {
    "theme-color": SiteConfig.themeColor,
    "color-scheme": "light dark",
    "msapplication-TileColor": SiteConfig.themeColor,
    "msapplication-config": "/browserconfig.xml",
  },

  // Search Console verification — store tokens in env vars
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    // yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    // other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION },
  },

  // Prevent iOS auto-linking plain text (breaks layouts)
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  referrer: "origin-when-cross-origin",
}
```

---

### 3. Static Page Metadata

For pages with known content at build time:

```typescript
// app/about/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About", // renders as "About | MySite" via template
  description: "Learn about our mission, team, and story.",
  alternates: {
    canonical: "https://yourdomain.com/about",
  },
  openGraph: {
    title: "About | MySite",
    description: "Learn about our mission, team, and story.",
    url: "https://yourdomain.com/about",
    images: [{ url: "https://yourdomain.com/og/about.png", width: 1200, height: 630 }],
  },
}
```

---

### 4. Dynamic Page Metadata (`generateMetadata`)

Use for any route with a `[slug]` or dynamic segment:

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from "next"

import { getPostBySlug } from "@/lib/blog"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
      robots: { index: false, follow: false },
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://yourdomain.com/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `https://yourdomain.com/blog/${slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.url],
      images: [
        {
          url: post.ogImage ?? `https://yourdomain.com/og/blog/${slug}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.ogImage ?? `https://yourdomain.com/og/blog/${slug}`],
    },
  }
}
```

---

### 5. Structured Data — JSON-LD

Inject as a `<script>` tag in the page component, **not** in metadata. One component per schema type.

#### WebSite Schema (root layout — enables sitelinks search box)

```tsx
// components/seo/JsonLdWebsite.tsx
export function JsonLdWebsite() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SiteConfig.name,
    url: process.env.NEXT_PUBLIC_DOMAIN,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_DOMAIN}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
```

#### Article Schema (blog posts)

```tsx
export function JsonLdArticle({ post }: { post: Post }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.ogImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: post.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: SiteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_DOMAIN}/blog/${post.slug}`,
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
```

#### Organization Schema (homepage)

```tsx
export function JsonLdOrganization() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SiteConfig.name,
    url: process.env.NEXT_PUBLIC_DOMAIN,
    logo: `${process.env.NEXT_PUBLIC_DOMAIN}/logo.png`,
    sameAs: [SiteConfig.twitterUrl, SiteConfig.linkedinUrl, SiteConfig.githubUrl].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      email: SiteConfig.contactEmail,
      contactType: "customer support",
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
```

#### BreadcrumbList Schema (nested pages)

```tsx
export function JsonLdBreadcrumb({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
```

#### FAQPage Schema

```tsx
export function JsonLdFaq({ faqs }: { faqs: { q: string; a: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
```

#### Product Schema (e-commerce)

```tsx
export function JsonLdProduct({ product }: { product: Product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/products/${product.slug}`,
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating.value,
          reviewCount: product.rating.count,
        }
      : undefined,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
```

---

### 6. Sitemap (`app/sitemap.ts`)

Use Next.js native convention — no external library needed.

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next"

import { getAllPosts } from "@/lib/blog"
import { getAllProducts } from "@/lib/products"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = process.env.NEXT_PUBLIC_DOMAIN!

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: domain,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1.0,
    },
    {
      url: `${domain}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${domain}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${domain}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ]

  // Dynamic blog routes
  const posts = await getAllPosts()
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${domain}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  // Dynamic product routes (if applicable)
  const products = await getAllProducts()
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${domain}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...blogRoutes, ...productRoutes]
}
```

---

### 7. Robots.txt (`app/robots.ts`)

```typescript
// app/robots.ts
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const domain = process.env.NEXT_PUBLIC_DOMAIN!

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/admin/", "/_next/", "/private/"],
      },
      // Block AI scrapers if desired
      // {
      //   userAgent: ["GPTBot", "CCBot", "anthropic-ai"],
      //   disallow: "/",
      // },
    ],
    sitemap: `${domain}/sitemap.xml`,
    host: domain,
  }
}
```

---

### 8. OG Image Generation (`app/opengraph-image.tsx`)

Dynamic per-page OG images using Next.js built-in ImageResponse:

```tsx
// app/opengraph-image.tsx  <- global fallback
import { ImageResponse } from "next/og"

import { SiteConfig } from "@/lib/site.config"

export const runtime = "edge"
export const alt = SiteConfig.name
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 700, color: "white", textAlign: "center" }}>{SiteConfig.name}</div>
      <div style={{ fontSize: 32, color: "#94a3b8", marginTop: 24, textAlign: "center" }}>{SiteConfig.description}</div>
    </div>,
    { ...size }
  )
}
```

```tsx
// app/blog/[slug]/opengraph-image.tsx  <- per-post OG image
import { ImageResponse } from "next/og"

import { getPostBySlug } from "@/lib/blog"

export const runtime = "edge"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  return new ImageResponse(
    <div
      style={{
        background: "#0f172a",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "60px",
      }}
    >
      <div style={{ fontSize: 18, color: "#3b82f6", marginBottom: 16 }}>{post?.category ?? "Blog"}</div>
      <div style={{ fontSize: 52, fontWeight: 700, color: "white", lineHeight: 1.2 }}>{post?.title}</div>
      <div style={{ fontSize: 24, color: "#94a3b8", marginTop: 20 }}>
        {post?.author?.name} · {post?.readingTime} min read
      </div>
    </div>,
    { ...size }
  )
}
```

---

### 9. Page-Level Robots Override

Some pages should never be indexed — always be explicit:

```typescript
// app/dashboard/layout.tsx - authenticated area
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

// app/thank-you/page.tsx - post-conversion page
export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: true },
}

// app/404 is handled automatically by Next.js with noindex
```

---

### 10. `SiteConfig` Shape Reference

The metadata depends on a centralized config. It should export at minimum:

```typescript
// lib/site.config.ts
export const SiteConfig = {
  name: "My App",
  description: "Short description under 160 chars.",
  keywords: ["keyword1", "keyword2"],
  author: "Author Name",
  authorUrl: "https://yourdomain.com",
  creator: "@twitterhandle",
  publisher: "My App Inc.",
  twitterCreator: "@twitterhandle",
  twitterSite: "@twitterhandle",
  twitterUrl: "https://twitter.com/yourhandle",
  linkedinUrl: "https://linkedin.com/company/yourcompany",
  githubUrl: "https://github.com/yourorg",
  contactEmail: "hello@yourdomain.com",
  themeColor: "#ffffff",
  ogTitle: "My App - Tagline here",
  ogDescription: "OG description under 200 chars.",
}
```

---

### 11. Performance Rules (Core Web Vitals = SEO signals)

- Always use `<Image />` from `next/image` — never `<img>` for content images.
- Always use `next/font` — never load fonts from Google Fonts CDN directly.
- Set `priority` prop on LCP images (hero/above-fold).
- Use `loading="lazy"` on all below-fold images (default in `next/image`).
- Prefer static generation (`export const dynamic = "force-static"`) for marketing pages.
- Avoid layout shifts: always set `width` and `height` on images; reserve space for dynamic content.
- Use `<link rel="preconnect">` in `<head>` for critical third-party origins.

---

### 12. Checklist — Before Shipping Any New Page

- [ ] Unique `title` (under 60 chars) set via `metadata` or `generateMetadata`
- [ ] Unique `description` (under 160 chars)
- [ ] `canonical` URL set in `alternates`
- [ ] OG image exists and is 1200x630px
- [ ] `twitter:card` is `summary_large_image`
- [ ] JSON-LD schema added (Article / Product / FAQ / Breadcrumb as appropriate)
- [ ] Page is included in `sitemap.ts` (or auto-included via dynamic generation)
- [ ] Private/auth pages have `robots: { index: false }`
- [ ] All `<img>` replaced with `next/image`
- [ ] No duplicate `<title>` or `<meta description>` across routes
- [ ] Validate structured data at https://search.google.com/test/rich-results
- [ ] Validate OG tags at https://www.opengraph.xyz

---

### 13. Common Mistakes to Avoid

- **Never** use an absolute path in `manifest` — use `"/site.webmanifest"` (relative).
- **Never** set `metadataBase` per-page — set it once in root `layout.tsx`.
- **Never** hardcode domain strings in metadata — always use `process.env.NEXT_PUBLIC_DOMAIN`.
- **Never** set `index: false` on pages you want ranked (auth pages, admin, `/api/*` only).
- **Never** rely on `<Head>` from `next/head` in App Router — use the Metadata API exclusively.
- **Avoid** identical OG title and page title — the OG title can be longer and more descriptive.
- **Avoid** missing `alt` text on OG images — it affects accessibility and some platforms.
- **Avoid** generating sitemaps that include 404 or redirect pages — validate before deploying.

//
