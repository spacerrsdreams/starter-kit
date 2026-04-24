import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { WebRoutes } from "@/lib/web.routes"
import { CreateBlogPostForm } from "@/features/blog/components/create-blog-post-form.client"
import { getAdminOrModeratorSession } from "@/features/blog/utils/get-admin-or-moderator-session.server"
import { HeaderNavigationClient } from "@/components/navigation/header-navigation.client"
import { TopGradient } from "@/components/ui/top-gradient"

import "@/features/blog/styles/blog-rich-content.css"

const title = "Create Blog Post"
const description = "Create a blog post from the admin panel."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: WebRoutes.createBlogPost.withBaseUrl(),
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function CreateBlogPostPage() {
  const session = await getAdminOrModeratorSession()

  if (!session?.user) {
    redirect(WebRoutes.signIn.path)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopGradient />
      <HeaderNavigationClient />
      <main className="container mx-auto min-h-screen px-4 py-36">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground">Create Post</h1>
            <p className="text-sm text-muted-foreground">Available for admin and moderator accounts.</p>
          </div>
          <CreateBlogPostForm />
        </div>
      </main>
    </div>
  )
}
