import { ContactPageContent } from "@/features/contact/components/contact-page-content"
import { Footer } from "@/components/footer/footer"
import { HeaderNavigationClient } from "@/components/navigation/header-navigation.client"
import { TopGradient } from "@/components/ui/top-gradient"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopGradient />
      <HeaderNavigationClient />
      <ContactPageContent />
      <Footer />
    </div>
  )
}
