import { Footer } from "@/components/footer/footer"
import { HeaderNavigationClient } from "@/components/navigation/header-navigation"
import { PricingContentPage } from "@/components/pricing/pricing-content-page"
import { TopGradient } from "@/components/ui/top-gradient"

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
