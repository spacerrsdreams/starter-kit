import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import { WebRoutes } from "@/lib/web.routes"
import { BlogPostActionsMenu } from "@/features/blog/components/blog-post-actions-menu.client"
import { getBlogPostBySlug } from "@/features/blog/repositories/blog-posts.repository"
import { getAdminOrModeratorSession } from "@/features/blog/utils/get-admin-or-moderator-session.server"
import { Footer } from "@/components/footer"
import { HeaderNavigationClient } from "@/components/navigation/header-navigation.client"
import { TopGradient } from "@/components/ui/top-gradient"

import "@/features/blog/styles/blog-rich-content.css"

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

function formatBlogDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

function getBlogContentHtml(content: unknown) {
  if (content && typeof content === "object" && !Array.isArray(content)) {
    const maybeHtml = (content as Record<string, unknown>).html
    if (typeof maybeHtml === "string" && maybeHtml.trim().length > 0) {
      return maybeHtml
    }
  }

  return "<p></p>"
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Blog Post Not Found",
    }
  }

  const canonical = WebRoutes.blogPost.withBaseUrl(slug)

  return {
    title: post.title,
    description: post.preview,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        "x-default": canonical,
      },
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const session = await getAdminOrModeratorSession()
  const viewerRole = session?.user?.role
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <TopGradient />
      <HeaderNavigationClient />
      <main className="container mx-auto min-h-screen px-4 py-36">
        <article className="relative mx-auto w-full max-w-4xl space-y-8">
          {viewerRole ? (
            <div className="absolute top-0 right-0 z-10">
              <BlogPostActionsMenu
                editHref={WebRoutes.editBlogPost(post.id)}
                postId={post.id}
                canDelete={viewerRole === "admin"}
              />
            </div>
          ) : null}
          <p className="text-center text-sm font-semibold text-muted-foreground">{formatBlogDate(post.createdAt)}</p>

          <h1 className="text-center text-5xl leading-tight font-semibold tracking-tight text-foreground">
            {post.title}
          </h1>

          <Image
            src={post.imageSrc}
            alt={post.title}
            width={1200}
            height={700}
            className="h-auto w-full rounded-2xl object-cover"
            priority
          />

          <p className="text-center text-base text-muted-foreground">{post.preview}</p>

          <hr className="border-border" />

          <div className="learn-rich-content" dangerouslySetInnerHTML={{ __html: getBlogContentHtml(post.content) }} />
        </article>
      </main>
      <Footer />
    </div>
  )
}
