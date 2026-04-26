import { ArrowRightIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

import { WebRoutes } from "@/lib/web.routes"
import { GetStartedCtaButton } from "@/components/marketing/get-started-cta-button"
import { BlurWaveTextAnimation } from "@/components/motion/blur-wave-text.animation"
import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"

import { Button } from "../ui/button"

export function Hero() {
  const t = useTranslations("home.hero")

  return (
    <BottomUpFadeAnimation>
      <section className="max-w-5-xl space-y-14 pt-30 sm:pt-45 md:space-y-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center">
          <span className="inline-flex items-center rounded-full border border-border/70 px-5 py-2 text-sm font-semibold text-foreground/90">
            {t("badge")}
          </span>
          <div className="mx-auto max-w-2xl">
            <BlurWaveTextAnimation
              text={t("title")}
              className="mt-8 justify-center text-4xl font-semibold tracking-[-3px] text-foreground md:text-6xl"
            />
          </div>
          <p className="mt-8 max-w-lg leading-relaxed tracking-tight text-foreground/90">{t("description")}</p>
          <div className="mt-10 flex flex-col gap-4">
            <Button asChild variant="outline" className="gap-2 rounded-full py-6.5!">
              <Link href={WebRoutes.dashboard.path}>
                {t("dashboardCta")}
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
            <GetStartedCtaButton label={t("cta")} />
          </div>
        </div>
      </section>
    </BottomUpFadeAnimation>
  )
}
