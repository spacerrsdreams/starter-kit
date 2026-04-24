import { Suspense } from "react"

import { DeactivationFeedbackPage } from "@/features/auth/account-deactivation/components/deactivation-feedback-page"
import { Spinner } from "@/components/ui/spinner"

type FeedbackPageProps = {
  searchParams?: Promise<{ error?: string }>
}

async function FeedbackContent({ searchParams }: FeedbackPageProps) {
  const resolvedSearchParams = await searchParams
  const hasError = resolvedSearchParams?.error === "invalid-feedback"

  return (
    <div className="relative z-10 flex min-h-dvh w-full items-center justify-center px-4 py-8">
      <DeactivationFeedbackPage hasError={hasError} />
    </div>
  )
}

export default function FeedbackPage({ searchParams }: FeedbackPageProps) {
  return (
    <Suspense fallback={<Spinner centered />}>
      <FeedbackContent searchParams={searchParams} />
    </Suspense>
  )
}
