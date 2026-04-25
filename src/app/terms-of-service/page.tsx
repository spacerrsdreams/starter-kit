import { TERMS_OF_SERVICE_SECTIONS } from "@/features/legal/constants/legal-content.constants"
import { Footer } from "@/components/footer/footer"
import { LegalSectionBlock } from "@/components/legal/legal-section-block"
import { BlurWaveTextAnimation } from "@/components/motion/blur-wave-text.animation"
import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"
import { HeaderNavigationClient } from "@/components/navigation/header-navigation.client"
import { TopGradient } from "@/components/ui/top-gradient"

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-background">
      <TopGradient />
      <HeaderNavigationClient />
      <main className="mx-auto w-full max-w-5xl px-4 py-30 sm:px-6 md:py-45">
        <div className="flex items-center justify-center">
          <BlurWaveTextAnimation
            className="text-3xl font-semibold tracking-[-3.5px] text-foreground sm:text-6xl"
            text="Terms & Conditions"
          />
        </div>
        <BottomUpFadeAnimation>
          <p className="mt-4 text-center leading-4 font-semibold tracking-wide text-muted-foreground">
            Last updated: April 21, 2026
          </p>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation>
          <div className="mt-20 space-y-16">
            {TERMS_OF_SERVICE_SECTIONS.map((section) => (
              <LegalSectionBlock key={section.title} title={section.title} description={section.description} />
            ))}
          </div>
        </BottomUpFadeAnimation>
      </main>
      <Footer />
    </div>
  )
}
