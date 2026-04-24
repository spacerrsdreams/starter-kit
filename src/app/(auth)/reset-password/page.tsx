import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { WebRoutes } from "@/lib/web.routes"
import { RequestPasswordResetForm } from "@/features/auth/components/reset-password/request-password-reset-form.client"
import { ResetPasswordForm } from "@/features/auth/components/reset-password/reset-password-form.client"
import { auth } from "@/features/auth/lib/auth"
import { GlassPanel } from "@/components/ui/glass-panel"
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
    <GlassPanel className="w-full max-w-md" size="sm">
      {token ? (
        <ResetPasswordForm token={token} initialError={error === "INVALID_TOKEN" ? error : null} />
      ) : (
        <RequestPasswordResetForm />
      )}
    </GlassPanel>
  )
}

export default function ResetPasswordPage(props: Props) {
  return (
    <Suspense fallback={<Spinner centered />}>
      <ResetPassword {...props} />
    </Suspense>
  )
}
