import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { listBlogPosts } from "@/features/blog/repositories/blog-posts.repository"

const RSS_FEED_LIMIT = 100

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function toRfc2822Date(value: Date): string {
  return value.toUTCString()
}

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN?.replace(/\/$/, "") ?? ""
  const feedUrl = `${domain}/rss.xml`
  const siteUrl = WebRoutes.root.withBaseUrl()
  const blogUrl = WebRoutes.blog.withBaseUrl()

  const posts = await listBlogPosts(RSS_FEED_LIMIT, 0)

  const itemsXml = posts
    .map((post) => {
      const postUrl = WebRoutes.blogPost.withBaseUrl(post.slug)
      const title = escapeXml(post.title)
      const description = escapeXml(post.preview)
      const guid = escapeXml(postUrl)
      const pubDate = toRfc2822Date(post.updatedAt)
      const categoryXml = post.seoKeywords.map((keyword) => `<category>${escapeXml(keyword)}</category>`).join("")

      return `
    <item>
      <title>${title}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      ${categoryXml}
    </item>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SiteConfig.name)} Blog</title>
    <link>${blogUrl}</link>
    <description>${escapeXml(SiteConfig.description)}</description>
    <language>en-US</language>
    <lastBuildDate>${toRfc2822Date(new Date())}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>${escapeXml(SiteConfig.name)}</generator>
    <ttl>60</ttl>${itemsXml}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex, follow",
      Link: `<${siteUrl}>; rel="home"`,
    },
  })
}
