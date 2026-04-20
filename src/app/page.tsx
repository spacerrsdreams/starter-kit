import Link from "next/link"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { Footer } from "@/components/footer"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">{SiteConfig.name}</h1>
        <p className="max-w-xl text-muted-foreground">
          Build faster with modern foundations, scalable UI patterns, and an integrated AI workspace.
        </p>
        <Link
          className="text-sm font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
          href={WebRoutes.askAi.path}
        >
          Explore AI page
        </Link>
      </main>
      <Footer />
    </div>
  )
}
