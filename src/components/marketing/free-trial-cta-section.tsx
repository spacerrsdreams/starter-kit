import Image from "next/image"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { WaveGlowButton } from "@/features/test/components/wave-glow-button"
import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"
import { LogoIcon } from "@/components/ui/icons/logo.icon"

type FreeTrialCtaSectionProps = {
  className?: string
}

export function FreeTrialCtaSection({ className }: FreeTrialCtaSectionProps) {
  return (
    <section className={className}>
      <BottomUpFadeAnimation delay={0.25}>
        <div className="relative mx-auto w-full max-w-4xl lg:overflow-hidden lg:pb-16">
          <div className="flex flex-col items-center px-4 text-center lg:hidden">
            <LogoIcon size={28} className="bg-accent-1" />
            <h2 className="mt-4 text-2xl font-semibold sm:text-4xl">Try {SiteConfig.name} Free for 14 Days</h2>
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              Start taking control of your business today
            </p>
            <div className="mt-8">
              <WaveGlowButton
                href={WebRoutes.dashboard.path}
                authenticatedHref={WebRoutes.dashboard.path}
                requireAuth
                label="Get Started"
              />
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

            <h2 className="mt-4 text-4xl font-semibold">Try {SiteConfig.name} Free for 14 Days</h2>
            <p className="mt-4 text-base text-muted-foreground">Start taking control of your business today</p>

            <div className="mt-8 pb-8">
              <WaveGlowButton
                href={WebRoutes.dashboard.path}
                authenticatedHref={WebRoutes.dashboard.path}
                requireAuth
                label="Get Started"
              />
            </div>
          </div>
        </div>
      </BottomUpFadeAnimation>
    </section>
  )
}
