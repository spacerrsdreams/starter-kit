import { ContactFormClient } from "@/features/contact/components/contact-form.client"
import { BlurWaveTextAnimation } from "@/components/ui/blur-wave-text.animation"
import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"
import { GlassPanel } from "@/components/ui/glass-panel"

const contactSteps = ["Leave us your details", "We will reach out within 24 hours", "Join a scheduled call"] as const

export function ContactPageContent() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-30 sm:px-6 md:py-45">
      <section className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-2">
        <div className="flex flex-col">
          <div className="space-y-4">
            <BlurWaveTextAnimation
              text="Get In Touch"
              className="text-5xl font-medium tracking-[-3.5px] text-foreground md:text-6xl"
            />
            <BottomUpFadeAnimation delay={0.25}>
              <p className="max-w-sm text-base leading-7 text-muted-foreground">
                We&apos;d love to hear from you! Whether you have questions, need support
              </p>
            </BottomUpFadeAnimation>
          </div>

          <ol className="mt-auto space-y-6 pt-12 md:pt-0">
            {contactSteps.map((step, index) => (
              <li key={step}>
                <BottomUpFadeAnimation delay={0.45 + index * 0.12}>
                  <div className="flex items-center gap-4">
                    <span className="flex size-8 items-center justify-center rounded-full border border-border text-sm font-medium text-foreground">
                      {index + 1}
                    </span>
                    <span className="text-base text-foreground">{step}</span>
                  </div>
                </BottomUpFadeAnimation>
              </li>
            ))}
          </ol>
        </div>

        <BottomUpFadeAnimation delay={0.35}>
          <GlassPanel>
            <ContactFormClient />
          </GlassPanel>
        </BottomUpFadeAnimation>
      </section>
    </main>
  )
}
