import Link from "next/link"

import { WebRoutes } from "@/lib/web.routes"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 text-center">
      <div className="flex max-w-lg flex-col items-center">
        <h1 className="mb-2 text-4xl font-medium text-foreground">404</h1>
        <h2 className="mb-3 text-xl font-medium text-foreground sm:text-2xl">Page not found</h2>
        <p className="mb-8 text-sm text-muted-foreground sm:text-base">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link href={WebRoutes.root.path}>Go back home</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={WebRoutes.root.path}>Go to dashboard</Link>
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
