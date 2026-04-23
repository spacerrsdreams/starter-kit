import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { WebRoutes } from "@/lib/web.routes"
import { AdminUsersTable } from "@/features/admin/components/admin-users-table.client"
import { getAdminSession } from "@/features/admin/utils/get-admin-session.server"
import { HeaderNavigationClient } from "@/components/header-navigation.client"
import { TopGradient } from "@/components/top-gradient"

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
          <h1 className="text-4xl font-semibold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Only users with the admin role can access this page.</p>
        </div>
        <AdminUsersTable currentUserId={session.user.id} />
      </main>
    </div>
  )
}
