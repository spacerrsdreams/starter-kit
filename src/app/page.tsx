import { Footer } from "@/components/footer"
import { HeaderNavigationClient } from "@/components/header-navigation.client"
import { DashboardPreviewClient } from "@/components/marketing/dashboard-preview.client"
import { Hero } from "@/components/marketing/hero"
import { KeyToolsScrollClient } from "@/components/marketing/key-tools-scroll.client"
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
            <KeyToolsScrollClient />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
