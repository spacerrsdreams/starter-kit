"use client"

import Link from "next/link"
import { useEffect } from "react"

import { WebRoutes } from "@/lib/web.routes"
import { Footer } from "@/components/footer"
import { HeaderNavigationClient } from "@/components/navigation/header-navigation.client"
import { Button } from "@/components/ui/button"
import { TopGradient } from "@/components/ui/top-gradient"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Error:", error)
  }, [error])

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
            <h2 className="-mt-3 text-4xl font-bold text-foreground">Sorry! Something went wrong...</h2>
            <p className="mt-4 max-w-xl text-xl text-foreground">
              If the problem persists, please contact{" "}
              <Link href={WebRoutes.contact.path}>
                <span className="font-semibold text-accent-1 underline">support</span>
              </Link>
              .
            </p>
            <div className="mt-10 flex flex-col gap-4">
              <Button
                asChild
                className="rounded-full bg-foreground px-8 py-6 font-bold hover:bg-foreground/90"
                featureStylesEnabled
              >
                <Link href={WebRoutes.root.path}>Go Back To Home</Link>
              </Button>
              <Button variant="outline" className="rounded-full px-8 py-6 font-bold" onClick={() => reset()}>
                Try again
              </Button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
