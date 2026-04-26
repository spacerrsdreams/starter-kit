import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { WebRoutes } from "@/lib/web.routes"
import { SignInPageContent } from "@/features/auth/components/sign-in/sign-in-page-content"
import { auth } from "@/features/auth/lib/auth"
import { Spinner } from "@/components/ui/spinner"

async function SignInComponent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect(WebRoutes.root.path)
  }

  return <SignInPageContent />
}

export default async function SignInPage() {
  return (
    <Suspense fallback={<Spinner centered />}>
      <SignInComponent />
    </Suspense>
  )
}
