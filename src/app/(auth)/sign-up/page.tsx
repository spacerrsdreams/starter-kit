import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { WebRoutes } from "@/lib/web.routes"
import { SignUpPageContent } from "@/features/auth/components/sign-up/sign-up-page-content.client"
import { auth } from "@/features/auth/lib/auth"
import { Spinner } from "@/components/ui/spinner"

async function SignUp() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect(WebRoutes.root.path)
  }

  return <SignUpPageContent />
}

export default async function SignUpPage() {
  return (
    <Suspense fallback={<Spinner centered />}>
      <SignUp />
    </Suspense>
  )
}
