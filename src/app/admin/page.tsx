import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { WebRoutes } from "@/lib/web.routes"
import { AdminUsersTable } from "@/features/admin/components/admin-users-table.client"
import { getAdminSession } from "@/features/admin/utils/get-admin-session.server"
import { HeaderNavigationClient } from "@/components/navigation/header-navigation.client"
import { Button } from "@/components/ui/button"
import { TopGradient } from "@/components/ui/top-gradient"

const title = "Admin"
const description = "Manage users and account access."
const canonical = WebRoutes.admin.withBaseUrl()

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminPage() {
  const session = await getAdminSession()
  if (!session?.user) {
    redirect(WebRoutes.signIn.path)
  }

  return (
    <div>
      <TopGradient />
      <HeaderNavigationClient />
      <main className="container mx-auto min-h-screen space-y-6 p-6 py-48">
        <div className="bg-background">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-4xl font-semibold">Admin Panel</h1>
            <Button asChild>
              <Link href={WebRoutes.createBlogPost.path}>Create Post</Link>
            </Button>
          </div>
          <p className="mb-20 text-sm text-muted-foreground">Only users with the admin role can access this page.</p>
          <AdminUsersTable currentUserId={session.user.id} />
        </div>
      </main>
    </div>
  )
}
