import { Footer } from "@/components/footer"
import { HeaderNavigationClient } from "@/components/header-navigation.client"
import { PricingContentPage } from "@/components/pricing/pricing-content-page"
import { TopGradient } from "@/components/top-gradient"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopGradient />
      <HeaderNavigationClient />
      <PricingContentPage />
      <Footer />
    </div>
  )
}
