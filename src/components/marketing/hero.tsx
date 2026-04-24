import { useTranslations } from "next-intl"

import { GetStartedCtaButton } from "@/components/marketing/get-started-cta-button.client"
import { BlurWaveTextAnimation } from "@/components/motion/blur-wave-text.animation"
import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"

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
          <div className="mt-10">
            <GetStartedCtaButton label={t("cta")} />
          </div>
        </div>
      </section>
    </BottomUpFadeAnimation>
  )
}
