import { Footer } from "@/components/footer"
import { HeaderNavigationClient } from "@/components/header-navigation.client"
import { AdvancedAnalyticsSection } from "@/components/marketing/advanced-analytics-section"
import { CoreFeaturesDarkSection } from "@/components/marketing/core-features-dark-section"
import { CustomerReviewsSection } from "@/components/marketing/customer-reviews-section"
import { DashboardPreviewClient } from "@/components/marketing/dashboard-preview.client"
import { FaqSectionClient } from "@/components/marketing/faq-section.client"
import { FreeTrialCtaSection } from "@/components/marketing/free-trial-cta-section"
import { Hero } from "@/components/marketing/hero"
import { InsideSalixSection } from "@/components/marketing/inside-salix-section"
import { KeyToolsScrollClient } from "@/components/marketing/key-tools-scroll.client"
import { PlanPickerSectionClient } from "@/components/marketing/plan-picker-section.client"
import { TrustedMarqueeClient } from "@/components/marketing/trusted-marquee.client"
import { WhyChooseSection } from "@/components/marketing/why-choose-section"
import { TopGradient } from "@/components/top-gradient"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto">
        <TopGradient />
        <HeaderNavigationClient />
        <main>
          <div className="mx-auto max-w-[1200px] border-r border-l border-border/75">
            <Hero />
            <DashboardPreviewClient />
            <TrustedMarqueeClient />
            <WhyChooseSection />
            <InsideSalixSection />
            <KeyToolsScrollClient />
          </div>
          <CoreFeaturesDarkSection />
          <div className="mx-auto max-w-[1200px] border-r border-l border-border/75">
            <AdvancedAnalyticsSection />
            <CustomerReviewsSection />
            <PlanPickerSectionClient />
            <FaqSectionClient />
          </div>
          <FreeTrialCtaSection className="mt-20 px-8" />
        </main>
        <Footer />
      </div>
    </div>
  )
}
