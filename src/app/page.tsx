import Link from "next/link"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1>{SiteConfig.name}</h1>
      <Link className="text-blue-500" href={WebRoutes.askAi.path}>
        Ask AI
      </Link>
    </div>
  )
}
