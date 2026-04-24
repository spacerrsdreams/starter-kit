import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { WebRoutes } from "@/lib/web.routes"
import { SignInPageDialog } from "@/features/auth/components/sign-in/sign-in-page-dialog.client"
import { auth } from "@/features/auth/lib/auth"
import { Spinner } from "@/components/ui/spinner"

async function SignInComponent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect(WebRoutes.root.path)
  }

  return (
    <div className="relative z-10 flex h-dvh min-h-0 w-full max-w-full min-w-0 flex-1 flex-col items-stretch justify-start px-0 py-0 md:h-auto md:min-h-full md:items-center md:justify-center md:px-4 md:py-8">
      <SignInPageDialog />
    </div>
  )
}

export default async function SignInPage() {
  return (
    <Suspense fallback={<Spinner centered />}>
      <SignInComponent />
    </Suspense>
  )
}
