import Image from "next/image"
import Link from "next/link"
import { z } from "zod"

import { WebRoutes } from "@/lib/web.routes"
import { BlogPostActionsMenu } from "@/features/blog/components/blog-post-actions-menu.client"
import { listBlogPosts } from "@/features/blog/repositories/blog-posts.repository"
import { getAdminOrModeratorSession } from "@/features/blog/utils/get-admin-or-moderator-session.server"
import { Footer } from "@/components/footer"
import { HeaderNavigationClient } from "@/components/header-navigation.client"
import { TopGradient } from "@/components/top-gradient"

const PAGE_SIZE = 9

const blogPageSearchParamsSchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
})

type BlogPageProps = {
  searchParams?: Promise<{ offset?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const session = await getAdminOrModeratorSession()
  const viewerRole = session?.user?.role
  const resolvedSearchParams = await searchParams
  const parsed = blogPageSearchParamsSchema.safeParse(resolvedSearchParams)
  const offset = parsed.success ? parsed.data.offset : 0

  const posts = await listBlogPosts(PAGE_SIZE, offset)
  const hasNextPage = posts.length === PAGE_SIZE
  const previousOffset = Math.max(0, offset - PAGE_SIZE)
  const nextOffset = offset + PAGE_SIZE

  return (
    <div className="min-h-screen bg-background">
      <TopGradient />
      <HeaderNavigationClient />
      <main className="container mx-auto min-h-screen px-4 py-36">
        <div className="mx-auto w-full max-w-5xl space-y-8">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-semibold text-foreground">Blog</h1>
                <p className="text-sm text-muted-foreground">
                  Server-rendered paginated feed. New posts are created from the admin create page.
                </p>
              </div>
              {viewerRole ? (
                <Link
                  href={WebRoutes.createBlogPost.path}
                  className="rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  Create Post
                </Link>
              ) : null}
            </div>
          </div>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="relative overflow-hidden rounded-xl border border-border bg-background">
                {viewerRole ? (
                  <div className="absolute top-3 right-3 z-10">
                    <BlogPostActionsMenu
                      editHref={WebRoutes.editBlogPost(post.id)}
                      postId={post.id}
                      canDelete={viewerRole === "admin"}
                    />
                  </div>
                ) : null}
                <Link href={WebRoutes.blogPost(post.slug)} className="block transition-colors hover:bg-muted/20">
                  <Image
                    src={post.imageSrc}
                    alt={post.title}
                    width={640}
                    height={320}
                    className="h-40 w-full object-cover"
                  />
                  <div className="space-y-3 p-4">
                    <h2 className="line-clamp-2 text-lg font-semibold text-foreground">{post.title}</h2>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{post.preview}</p>
                    <div className="flex flex-wrap gap-2">
                      {post.seoKeywords.slice(0, 3).map((keyword) => (
                        <span
                          key={`${post.id}-${keyword}`}
                          className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </section>

          <div className="flex items-center justify-between">
            {offset > 0 ? (
              <Link
                href={`${WebRoutes.blog.path}?offset=${previousOffset}`}
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                Previous
              </Link>
            ) : (
              <span />
            )}

            {hasNextPage ? (
              <Link
                href={`${WebRoutes.blog.path}?offset=${nextOffset}`}
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
