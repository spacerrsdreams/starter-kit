import { Suspense } from "react"

import { DeactivationFeedbackPage } from "@/features/auth/account-deactivation/components/deactivation-feedback-page"
import { Footer } from "@/components/footer/footer"
import { HeaderNavigationClient } from "@/components/navigation/header-navigation"
import { Spinner } from "@/components/ui/spinner"
import { TopGradient } from "@/components/ui/top-gradient"

type FeedbackPageProps = {
  searchParams?: Promise<{ error?: string }>
}

async function FeedbackContent({ searchParams }: FeedbackPageProps) {
  const resolvedSearchParams = await searchParams
  const hasError = resolvedSearchParams?.error === "invalid-feedback"

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-30 sm:px-6 md:py-45">
      <DeactivationFeedbackPage hasError={hasError} />
    </div>
  )
}

export default function FeedbackPage({ searchParams }: FeedbackPageProps) {
  return (
    <main className="bg-background">
      <TopGradient />
      <HeaderNavigationClient />
      <Suspense fallback={<Spinner centered />}>
        <FeedbackContent searchParams={searchParams} />
      </Suspense>
      <Footer />
    </main>
  )
}
