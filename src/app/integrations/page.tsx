import { Footer } from "@/components/footer"
import { IntegrationsSection } from "@/components/marketing/integrations-section"
import { HeaderNavigationClient } from "@/components/navigation/header-navigation.client"
import { TopGradient } from "@/components/ui/top-gradient"

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopGradient />
      <HeaderNavigationClient />
      <main className="min-h-screen py-20">
        <IntegrationsSection />
      </main>
      <div className="container mx-auto border-r border-l border-border/75">
        <Footer />
      </div>
    </div>
  )
}
