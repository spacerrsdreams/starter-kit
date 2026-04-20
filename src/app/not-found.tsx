import Link from "next/link"

import { WebRoutes } from "@/lib/web.routes"
import { Footer } from "@/components/footer"
import { HeaderNavigationClient } from "@/components/header-navigation.client"
import { TopGradient } from "@/components/top-gradient"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl border-r border-l border-border/75">
        <div className="mx-auto max-w-5xl">
          <TopGradient />
          <HeaderNavigationClient />
          <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center text-center">
            <h1 className="text-[220px] leading-none font-semibold tracking-tight text-black md:text-[280px]">
              4<span className="text-accent-1">0</span>4
            </h1>
            <h2 className="-mt-3 text-4xl font-bold text-foreground">Sorry! Page not found</h2>
            <p className="mt-4 max-w-xl text-xl text-foreground">
              The page you are looking for does not exist or has been moved.
            </p>
            <Button
              asChild
              className="mt-10 rounded-full bg-foreground px-8 py-6 font-bold hover:bg-foreground/90"
              featureStylesEnabled
            >
              <Link href={WebRoutes.root.path}>Go Back To Home</Link>
            </Button>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
