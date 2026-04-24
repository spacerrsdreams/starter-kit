import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { WebRoutes } from "@/lib/web.routes"
import { RequestPasswordResetForm } from "@/features/auth/components/reset-password/request-password-reset-form.client"
import { ResetPasswordForm } from "@/features/auth/components/reset-password/reset-password-form.client"
import { auth } from "@/features/auth/lib/auth"
import { Spinner } from "@/components/ui/spinner"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function ResetPassword({ searchParams }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    return redirect(WebRoutes.root.path)
  }

  const sp = await searchParams
  const token = typeof sp.token === "string" ? sp.token : null
  const error = typeof sp.error === "string" ? sp.error : null

  return (
    <div className="relative z-10 flex h-dvh min-h-0 w-full max-w-full min-w-0 flex-1 flex-col items-stretch justify-start px-0 py-0 md:h-auto md:min-h-full md:items-center md:justify-center md:px-4 md:py-8">
      {token ? (
        <ResetPasswordForm token={token} initialError={error === "INVALID_TOKEN" ? error : null} />
      ) : (
        <RequestPasswordResetForm />
      )}
    </div>
  )
}

export default function ResetPasswordPage(props: Props) {
  return (
    <Suspense fallback={<Spinner centered />}>
      <ResetPassword {...props} />
    </Suspense>
  )
}
