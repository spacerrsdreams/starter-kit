## SEO Skill — Next.js App Router (TypeScript) · v16

Scope: Every page, route, and file that affects how search engines and social platforms discover, index, and display this project.
Stack: Next.js 16 · TypeScript 5.1+ · Tailwind CSS · React 19.2
Node.js minimum: 20.9.0 LTS

### 1. Core Principles

- Every page must have a unique `<title>` and `<meta description>`.
- Never duplicate metadata across routes — use `generateMetadata` for dynamic pages.
- Canonical URLs must always be explicit — never rely on defaults.
- For i18n projects with English as default, canonical URLs for English must stay non-prefixed (no `/en`).
- Always include `hreflang="x-default"` pointing to the non-prefixed English canonical URL.
- `robots` directives must be set globally in `layout.tsx` and overridden per-page where needed.
- Structured data (JSON-LD) must be added to every page that qualifies for rich results.
- OG images must be 1200×630px. Never use a placeholder or missing image.
- Sitemap and robots.txt must be generated via Next.js native file conventions (`sitemap.ts`, `robots.ts`).
- Performance IS SEO: use `next/image`, `next/font`, and minimize CLS/LCP.
- Static generation is opt-in. Add `export const dynamic = "force-static"` to every marketing/public page you want pre-rendered at build time.
- Use `use cache` to cache components or data-fetching functions — never rely on implicit route-level caching.
- `params` is always a `Promise` — always `await` it before use, including in OG image files.

### 2. Root Layout Metadata (`app/layout.tsx`)

```typescript
import type { Metadata } from "next"
import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN!),

  title: {
    default: SiteConfig.name,
    template: `%s | ${SiteConfig.name}`,
  },
  description: SiteConfig.description,
  keywords: SiteConfig.keywords,
  authors: [{ name: SiteConfig.author, url: SiteConfig.authorUrl }],
  creator: SiteConfig.creator,
  publisher: SiteConfig.name,

  alternates: {
    canonical: WebRoutes.root.withBaseUrl(),
    types: {
      "application/rss+xml": `${process.env.NEXT_PUBLIC_DOMAIN}/rss.xml`,
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
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/opengraph-image-square.png`,
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
    images: [`${process.env.NEXT_PUBLIC_DOMAIN}/opengraph-image.png`],
    creator: SiteConfig.twitterCreator,
    site: SiteConfig.twitterSite,
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
        // @ts-expect-error - not in Next.js types but used by browsers
        color: SiteConfig.themeColor,
      },
    ],
  },

  manifest: "/site.webmanifest",

  other: {
    "theme-color": SiteConfig.themeColor,
    "color-scheme": "light dark",
    "msapplication-TileColor": SiteConfig.themeColor,
    "msapplication-config": "/browserconfig.xml",
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  referrer: "origin-when-cross-origin",
}
```

### 3. Static Page Metadata

Pages are dynamic by default. Every marketing or public page must explicitly opt into static generation:

```typescript
// app/about/page.tsx
import type { Metadata } from "next"

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "About",
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

export default function AboutPage() {
  return <main>{/* ... */}</main>
}
```

### 4. Dynamic Page Metadata (`generateMetadata`)

`params` is a `Promise` — always `await` it. Use `PageProps` from `npx next typegen` for fully type-safe access:

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

// Export generateStaticParams so posts are pre-rendered at build time.
// Without this, every post renders dynamically on each request.
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
```

### 5. Structured Data — JSON-LD

Inject JSON-LD as a `<script>` tag inside the page component, never inside metadata.

#### WebSite Schema (root layout)

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
    author: { "@type": "Person", name: post.author.name, url: post.author.url },
    publisher: {
      "@type": "Organization",
      name: SiteConfig.name,
      logo: { "@type": "ImageObject", url: `${process.env.NEXT_PUBLIC_DOMAIN}/logo.png` },
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

#### BreadcrumbList Schema

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

#### Product Schema

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
      ? { "@type": "AggregateRating", ratingValue: product.rating.value, reviewCount: product.rating.count }
      : undefined,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
```

### 6. Sitemap (`app/sitemap.ts`)

For simple single-file sitemaps the API is straightforward. If you use `generateSitemaps` for large sites, `id` is a `Promise<string>` and must be awaited.

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"
import { getAllProducts } from "@/lib/products"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = process.env.NEXT_PUBLIC_DOMAIN!

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: domain, lastModified: new Date(), changeFrequency: "yearly", priority: 1.0 },
    { url: `${domain}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${domain}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${domain}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ]

  const posts = await getAllPosts()
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${domain}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

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

For paginated sitemaps using `generateSitemaps`, `id` must be awaited:

```typescript
// app/product/sitemap.ts
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }]
}

export default async function sitemap({ id }: { id: Promise<string> }) {
  const resolvedId = await id
  const start = Number(resolvedId) * 50000
  // fetch and return product URLs for this chunk
}
```

### 7. Robots.txt (`app/robots.ts`)

Do not include a `host` field — it is not a valid robots.txt directive and Next.js does not output it.

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
      // Block AI scrapers if desired:
      // { userAgent: ["GPTBot", "CCBot", "anthropic-ai"], disallow: "/" },
    ],
    sitemap: `${domain}/sitemap.xml`,
  }
}
```

### 8. OG Image Generation

`params` in `opengraph-image.tsx`, `twitter-image.tsx`, `icon`, and `apple-icon` is a `Promise` and must be awaited. The synchronous signature causes a runtime error.

Global fallback has no `params` and is straightforward:

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from "next/og"
import { SiteConfig } from "@/lib/site.config"

export const runtime = "edge"
export const alt = SiteConfig.name
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px" }}>
      <div style={{ fontSize: 72, fontWeight: 700, color: "white", textAlign: "center" }}>{SiteConfig.name}</div>
      <div style={{ fontSize: 32, color: "#94a3b8", marginTop: 24, textAlign: "center" }}>{SiteConfig.description}</div>
    </div>,
    { ...size }
  )
}
```

Per-route OG images must await params:

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og"
import { getPostBySlug } from "@/lib/blog"

export const runtime = "edge"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  return new ImageResponse(
    <div style={{ background: "#0f172a", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "60px" }}>
      <div style={{ fontSize: 18, color: "#3b82f6", marginBottom: 16 }}>{post?.category ?? "Blog"}</div>
      <div style={{ fontSize: 52, fontWeight: 700, color: "white", lineHeight: 1.2 }}>{post?.title}</div>
      <div style={{ fontSize: 24, color: "#94a3b8", marginTop: 20 }}>{post?.author?.name} · {post?.readingTime} min read</div>
    </div>,
    { ...size }
  )
}
```

### 9. Caching Strategy for SEO Pages

All routes are dynamic by default — nothing is cached unless you explicitly opt in. Choose the right strategy per page type.

Option A — `force-static` for marketing pages with no dynamic data:

```typescript
// app/pricing/page.tsx
export const dynamic = "force-static"

export default function PricingPage() { /* ... */ }
```

Option B — `use cache` on data-fetching functions for pages with CMS or DB data you want cached:

```typescript
// lib/blog.ts
import { unstable_cacheTag as cacheTag } from "next/cache"

export async function getAllPosts() {
  "use cache"
  cacheTag("posts")
  // fetch from CMS / DB
}
```

```typescript
// app/blog/page.tsx
export default async function BlogPage() {
  const posts = await getAllPosts() // served from cache
  return <PostList posts={posts} />
}
```

Option C — Suspense boundaries for pages that mix static and dynamic content:

```tsx
// app/product/[slug]/page.tsx
import { Suspense } from "react"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <main>
      <StaticProductInfo slug={slug} />       {/* pre-rendered */}
      <Suspense fallback={<Spinner />}>
        <DynamicInventory slug={slug} />      {/* request-time */}
      </Suspense>
    </main>
  )
}
```

### 10. Page-Level Robots Override

```typescript
// app/dashboard/layout.tsx — authenticated area, never index
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

// app/thank-you/page.tsx — post-conversion, no index
export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: true },
}
```

### 11. Proxy (`proxy.ts`) — SEO Redirects

SEO redirect logic belongs in `proxy.ts`. The proxy runs on Node.js runtime only — do not use edge-runtime APIs here. If you need edge runtime for geo-based redirects, keep a separate `middleware.ts` alongside it.

```typescript
// proxy.ts
import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/articles/")) {
    const newPath = pathname.replace("/articles/", "/blog/")
    return NextResponse.redirect(new URL(newPath, request.url), { status: 301 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/articles/:path*"],
}
```

### 12. `SiteConfig` Shape Reference

```typescript
// lib/site.config.ts
export const SiteConfig = {
  name: "My App",
  description: "Short description under 160 chars.",
  keywords: ["keyword1", "keyword2"],  // Google ignores this tag; Bing gives it negligible weight
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

### 13. Performance Rules (Core Web Vitals = SEO signals)

- Always use `<Image />` from `next/image` — never `<img>` for content images.
- Always use `next/font` — never load fonts from Google Fonts CDN directly.
- Set `priority` prop on LCP images (hero/above-fold).
- `loading="lazy"` is the default in `next/image` — leave it alone for below-fold images.
- Every marketing page needs `export const dynamic = "force-static"` — there is no implicit static generation.
- Use `use cache` on data-fetching functions to cache at the data layer, not the route layer.
- Always set `width` and `height` on images to prevent layout shifts.
- Use `<link rel="preconnect">` for critical third-party origins.
- Enable the React Compiler with `reactCompiler: true` in `next.config.ts` — stable in Next.js 16, eliminates unnecessary re-renders with zero code changes.

### 14. Checklist — Before Shipping Any New Page

- [ ] Unique `title` under 60 chars
- [ ] Unique `description` under 160 chars
- [ ] `canonical` URL set in `alternates`
- [ ] OG image exists and is 1200×630px
- [ ] `twitter:card` is `summary_large_image`
- [ ] JSON-LD schema added (Article / Product / FAQ / Breadcrumb as appropriate)
- [ ] Page included in `sitemap.ts`
- [ ] Private/auth pages have `robots: { index: false }`
- [ ] All `<img>` replaced with `next/image`
- [ ] No duplicate `<title>` or `<meta description>` across routes
- [ ] `params` typed as `Promise<{...}>` and awaited everywhere including `opengraph-image.tsx`
- [ ] Marketing pages have `export const dynamic = "force-static"` or `use cache` on data fetches
- [ ] SEO redirect logic is in `proxy.ts`
- [ ] `experimental.ppr` is not present in `next.config.ts`
- [ ] Validate structured data at https://search.google.com/test/rich-results
- [ ] Validate OG tags at https://www.opengraph.xyz

### 15. What Not To Do

- Never set `metadataBase` per-page — set it once in root `layout.tsx`.
- Never hardcode domain strings in metadata — always use `process.env.NEXT_PUBLIC_DOMAIN`.
- Never set `index: false` on pages you want ranked.
- Never use `<Head>` from `next/head` in App Router — use the Metadata API exclusively.
- Never access `params` synchronously in any file — it is always a Promise and will throw.
- Never assume a page is statically generated by default — it is not. Always be explicit.
- Never use `experimental.ppr: true` in `next.config.ts` — it does not exist in Next.js 16.
- Never combine `export const dynamic = "force-static"` and `use cache` on the same route without understanding that `force-static` wins at the route level.
- Never include the `host` field in `robots.ts` — it is not a valid robots.txt directive.
- Avoid identical OG title and page title — the OG title can be longer and more descriptive.
- Avoid generating sitemaps that include 404 or redirect pages.
