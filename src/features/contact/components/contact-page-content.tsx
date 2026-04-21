import { Quote } from "lucide-react"
import Image from "next/image"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { ContactFormClient } from "@/features/contact/components/contact-form.client"
import { WaveGlowButton } from "@/features/test/components/wave-glow-button"
import { BlurWaveTextAnimation } from "@/components/ui/blur-wave-text.animation"
import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"
import { GlassPanel } from "@/components/ui/glass-panel"
import { LogoIcon } from "@/components/ui/icons/logo.icon"

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

      <section className="mt-28 space-y-12">
        <BottomUpFadeAnimation delay={0.25}>
          <div className="space-y-3 text-center">
            <h2 className="text-4xl font-medium tracking-[-2px] text-foreground md:text-5xl">
              Chosen by +2,500 companies
            </h2>
            <p className="text-base text-muted-foreground">
              Businesses choose Salix because it simplifies the complexity
            </p>
          </div>
        </BottomUpFadeAnimation>

        <div className="grid gap-6 lg:grid-cols-2">
          <BottomUpFadeAnimation delay={0.35}>
            <div className="flex h-full flex-col space-y-8 rounded-xl border p-8">
              <div className="space-y-5 border-b border-border/70 pb-8">
                <p className="text-2xl font-medium text-foreground">Nexora</p>
                <Quote className="size-5 text-muted-foreground" />
                <p className="text-lg leading-8 text-foreground">
                  We used to juggle spreadsheets and emails. Now everything is in one place. Orders, inventory,
                  customers super smooth and efficient!
                </p>
                <p className="text-base text-muted-foreground">Albert Flores Co-founder at Nexora</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-4xl font-semibold text-accent-1">$200K</p>
                  <p className="mt-2 text-sm text-muted-foreground">Revenue boost per year</p>
                </div>
                <div>
                  <p className="text-4xl font-semibold text-accent-1">80-90%</p>
                  <p className="mt-2 text-sm text-muted-foreground">Revenue boost per year</p>
                </div>
              </div>
            </div>
          </BottomUpFadeAnimation>

          <BottomUpFadeAnimation delay={0.45}>
            <div className="relative h-full min-h-[420px] overflow-hidden rounded-xl border lg:min-h-0">
              <Image
                src="/assets/placeholder.webp"
                alt="Customer portrait"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="eager"
                className="rounded-xl object-cover"
              />
            </div>
          </BottomUpFadeAnimation>
        </div>
      </section>

      <section className="mt-20">
        <BottomUpFadeAnimation delay={0.25}>
          <div className="relative mx-auto w-full max-w-4xl lg:overflow-hidden lg:pb-16">
            <div className="flex flex-col items-center px-4 text-center lg:hidden">
              <LogoIcon size={28} className="bg-accent-1" />
              <h2 className="mt-4 text-2xl font-semibold tracking-[-2px] sm:text-4xl">
                Try {SiteConfig.name} Free for 14 Days
              </h2>
              <p className="mt-4 text-sm text-muted-foreground sm:text-base">
                Start taking control of your business today
              </p>
              <div className="mt-8">
                <WaveGlowButton href={WebRoutes.pricing.path} label="Get 14 Days Free Trial" />
              </div>
            </div>

            <div className="mx-auto mt-8 w-full rounded-sm bg-secondary/90 p-2 sm:rounded-md sm:p-4 lg:mt-0 lg:backdrop-blur-xl">
              <div className="relative aspect-849/510 overflow-hidden rounded-sm border sm:rounded-md">
                <Image
                  src="/assets/dashboard.webp"
                  alt={`${SiteConfig.name} Dashboard preview`}
                  fill
                  sizes="(min-width: 1024px) 849px, 92vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 z-10 hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.19)_32%,rgba(255,255,255,1)_55%,rgba(255,255,255,1)_89%)] lg:block" />

            <div className="absolute bottom-0 left-1/2 z-20 hidden w-full max-w-[640px] -translate-x-1/2 flex-col items-center px-4 text-center lg:flex">
              <LogoIcon size={28} className="bg-accent-1" />

              <h2 className="mt-4 text-4xl font-semibold tracking-[-2px]">Try {SiteConfig.name} Free for 14 Days</h2>
              <p className="mt-4 text-base text-muted-foreground">Start taking control of your business today</p>

              <div className="mt-8 pb-8">
                <WaveGlowButton href={WebRoutes.pricing.path} label="Get 14 Days Free Trial" />
              </div>
            </div>
          </div>
        </BottomUpFadeAnimation>
      </section>
    </main>
  )
}
