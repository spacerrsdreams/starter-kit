import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { WebRoutes } from "@/lib/web.routes"
import { EditBlogPostForm } from "@/features/blog/components/edit-blog-post-form.client"
import { getBlogPostById } from "@/features/blog/repositories/blog-posts.repository"
import { getAdminOrModeratorSession } from "@/features/blog/utils/get-admin-or-moderator-session.server"
import { HeaderNavigationClient } from "@/components/header-navigation.client"
import { TopGradient } from "@/components/top-gradient"
import "@/features/blog/styles/blog-rich-content.css"

type EditBlogPostPageProps = {
  params: Promise<{ postId: string }>
}

const title = "Edit Blog Post"
const description = "Edit blog post content."

function getBlogContentHtml(content: unknown) {
  if (content && typeof content === "object" && !Array.isArray(content)) {
    const maybeHtml = (content as Record<string, unknown>).html
    if (typeof maybeHtml === "string" && maybeHtml.trim().length > 0) {
      return maybeHtml
    }
  }
  return "<p></p>"
}

export const metadata: Metadata = {
  title,
  description,
  robots: {
    index: false,
    follow: false,
  },
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const session = await getAdminOrModeratorSession()
  if (!session?.user) {
    redirect(WebRoutes.signIn.path)
  }

  const { postId } = await params
  const post = await getBlogPostById(postId)
  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <TopGradient />
      <HeaderNavigationClient />
      <main className="container mx-auto min-h-screen px-4 py-36">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground">Edit Post</h1>
            <p className="text-sm text-muted-foreground">Admin can edit and delete. Moderator can edit only.</p>
          </div>
          <EditBlogPostForm
            postId={post.id}
            initialTitle={post.title}
            initialSlug={post.slug}
            initialPreview={post.preview}
            initialSeoKeywords={post.seoKeywords}
            initialContentHtml={getBlogContentHtml(post.content)}
            initialImageSrc={post.imageSrc}
          />
        </div>
      </main>
    </div>
  )
}
