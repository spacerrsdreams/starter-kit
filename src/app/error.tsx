"use client"

import Link from "next/link"
import { useEffect } from "react"

import { WebRoutes } from "@/lib/web.routes"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 text-center">
      <div className="flex max-w-lg flex-col items-center">
        <h1 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">Something went wrong</h1>
        <p className="mb-8 text-sm text-muted-foreground sm:text-base">
          If the problem persists, please contact support.
        </p>
        <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <Button className="w-full sm:w-auto" onClick={() => reset()}>
            Try again
          </Button>
          <Button asChild className="w-full sm:w-auto" variant="outline">
            <Link href={WebRoutes.root.path}>Go back home</Link>
          </Button>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          <Link
            href={WebRoutes.root.path}
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Need help? Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}
