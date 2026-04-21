import { Footer } from "@/components/footer"
import { HeaderNavigationClient } from "@/components/header-navigation.client"
import { Hero } from "@/components/marketing/hero"
import { TopGradient } from "@/components/top-gradient"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl">
        <TopGradient />
        <HeaderNavigationClient />
        <main className="mx-auto max-w-5xl px-4 py-30 sm:px-6 md:py-45">
          <Hero />
        </main>
        <Footer />
      </div>
    </div>
  )
}
