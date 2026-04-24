import Image from "next/image"
import { useTranslations } from "next-intl"

import { SiteConfig } from "@/lib/site.config"
import { GetStartedCtaButton } from "@/components/marketing/get-started-cta-button.client"
import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"
import { LogoIcon } from "@/components/ui/icons/logo.icon"

type FreeTrialCtaSectionProps = {
  className?: string
}

export function FreeTrialCtaSection({ className }: FreeTrialCtaSectionProps) {
  const t = useTranslations("home.freeTrial")

  return (
    <section className={className}>
      <BottomUpFadeAnimation delay={0.25}>
        <div className="relative mx-auto w-full max-w-4xl lg:overflow-hidden lg:pb-16">
          <div className="flex flex-col items-center px-4 text-center lg:hidden">
            <LogoIcon size={28} className="bg-accent-1" />
            <h2 className="mt-4 text-2xl font-semibold tracking-[-2.5px] sm:text-4xl">{t("title", { name: SiteConfig.name })}</h2>
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">{t("description")}</p>
            <div className="mt-8">
              <GetStartedCtaButton label={t("cta")} />
            </div>
          </div>

          <div className="mx-auto mt-8 w-full rounded-sm bg-secondary/90 p-2 sm:rounded-md sm:p-4 lg:mt-0 lg:backdrop-blur-xl">
            <div className="relative aspect-849/510 overflow-hidden rounded-sm border sm:rounded-md">
              <Image
                src="/assets/dashboard.webp"
                alt={t("dashboardPreviewAlt", { name: SiteConfig.name })}
                fill
                sizes="(min-width: 1024px) 849px, 92vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.19)_32%,rgba(255,255,255,1)_55%,rgba(255,255,255,1)_89%)] lg:block" />

          <div className="absolute bottom-0 left-1/2 z-20 hidden w-full max-w-[640px] -translate-x-1/2 flex-col items-center px-4 text-center lg:flex">
            <LogoIcon size={28} className="bg-accent-1" />

            <h2 className="mt-4 text-4xl font-semibold tracking-[-2.5px]">{t("title", { name: SiteConfig.name })}</h2>
            <p className="mt-4 text-base text-muted-foreground">{t("description")}</p>

            <div className="mt-8 pb-8">
              <GetStartedCtaButton label={t("cta")} />
            </div>
          </div>
        </div>
      </BottomUpFadeAnimation>
    </section>
  )
}
