import dynamic from "next/dynamic"

import { DashboardPreviewClient } from "@/components/marketing/dashboard-preview.client"
import { Hero } from "@/components/marketing/hero"
import { IntegrationsSection } from "@/components/marketing/integrations-section"
import { WhyChooseSection } from "@/components/marketing/why-choose-section"
import { HeaderNavigationClient } from "@/components/navigation/header-navigation.client"
import { TopGradient } from "@/components/ui/top-gradient"

const TrustedMarqueeClient = dynamic(() =>
  import("@/components/marketing/trusted-marquee.client").then((module) => module.TrustedMarqueeClient)
)
const KeyToolsScrollClient = dynamic(() =>
  import("@/components/marketing/key-tools-scroll.client").then((module) => module.KeyToolsScrollClient)
)
const CoreFeaturesDarkSection = dynamic(() =>
  import("@/components/marketing/core-features-dark-section").then((module) => module.CoreFeaturesDarkSection)
)
const AdvancedAnalyticsSection = dynamic(() =>
  import("@/components/marketing/advanced-analytics-section").then((module) => module.AdvancedAnalyticsSection)
)
const CustomerReviewsSection = dynamic(() =>
  import("@/components/marketing/customer-reviews-section").then((module) => module.CustomerReviewsSection)
)
const PlanPickerSectionClient = dynamic(() =>
  import("@/components/marketing/plan-picker-section.client").then((module) => module.PlanPickerSectionClient)
)
const FaqSectionClient = dynamic(() =>
  import("@/components/marketing/faq-section.client").then((module) => module.FaqSectionClient)
)
const FreeTrialCtaSection = dynamic(() =>
  import("@/components/marketing/free-trial-cta-section").then((module) => module.FreeTrialCtaSection)
)
const Footer = dynamic(() => import("@/components/footer/footer").then((module) => module.Footer))

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto">
        <TopGradient />
        <HeaderNavigationClient />
        <main>
          <div className="container mx-auto border-r border-l border-border/75">
            <Hero />
            <DashboardPreviewClient />
            <TrustedMarqueeClient />
            <WhyChooseSection />
            <IntegrationsSection />
            <KeyToolsScrollClient />
          </div>
          <CoreFeaturesDarkSection />
          <div className="container mx-auto border-r border-l border-border/75">
            <AdvancedAnalyticsSection />
            <CustomerReviewsSection />
            <PlanPickerSectionClient />
            <FaqSectionClient />
            <FreeTrialCtaSection className="mt-20 mb-28 px-8" />
            <Footer />
          </div>
        </main>
      </div>
    </div>
  )
}
