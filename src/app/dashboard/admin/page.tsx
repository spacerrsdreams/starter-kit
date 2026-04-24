import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { WebRoutes } from "@/lib/web.routes"
import { AdminUsersTable } from "@/features/admin/components/admin-users-table.client"
import { getAdminSession } from "@/features/admin/utils/get-admin-session.server"
import { Button } from "@/components/ui/button"

const title = "Admin"
const description = "Manage users and account access."
const canonical = WebRoutes.admin.withBaseUrl()

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
    languages: {
      en: canonical,
      "x-default": canonical,
    },
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
    <main className="space-y-6 p-4 md:p-6">
      <AdminUsersTable currentUserId={session.user.id} />
    </main>
  )
}
