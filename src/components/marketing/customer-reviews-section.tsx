import { UserStar } from "lucide-react"
import { useTranslations } from "next-intl"

import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"
import { Chip } from "@/components/ui/chip"
import { CountUpNumberAnimation } from "@/components/motion/count-up-number.animation"

export function CustomerReviewsSection() {
  const t = useTranslations("home.customerReviews")

  return (
    <section className="w-full px-4 py-14 md:py-20 lg:px-8">
      <BottomUpFadeAnimation>
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Chip Icon={UserStar} title={t("chip")} />
          <h2 className="mt-6 text-3xl font-semibold tracking-[-2.5px] text-foreground md:text-4xl">
            {t("title")}
          </h2>
        </div>
      </BottomUpFadeAnimation>

      <div className="mx-auto mt-10 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
        <BottomUpFadeAnimation className="sm:col-span-1 lg:col-span-3" delay={0.05}>
          <article className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-accent-1 px-14 py-18 text-center text-background">
            <CountUpNumberAnimation
              to={60}
              suffix="%"
              duration={3}
              className="text-5xl font-semibold tracking-tight md:text-6xl"
            />
            <p className="mt-4 text-lg text-background/90">{t("stats.adminWorkReduced")}</p>
          </article>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation className="sm:col-span-1 lg:col-span-6" delay={0.1}>
          <article className="h-full rounded-xl border border-foreground/10 bg-foreground p-8 text-background">
            <p className="font-medium md:text-lg">
              {t("quotes.quoteOneText")}
            </p>
            <div className="mt-8">
              <p className="text-lg font-semibold">{t("quotes.quoteOneAuthor")}</p>
              <p className="text-sm text-background/70">{t("quotes.quoteOneRole")}</p>
            </div>
          </article>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation className="sm:col-span-1 lg:col-span-3" delay={0.15}>
          <article className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-background px-14 py-18 text-center">
            <CountUpNumberAnimation
              to={45}
              suffix="%"
              duration={3}
              className="text-5xl font-semibold tracking-tight text-foreground md:text-6xl"
            />
            <p className="mt-4 text-lg text-muted-foreground">{t("stats.revenueBoostPerYear")}</p>
          </article>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation className="sm:col-span-1 lg:col-span-3" delay={0.2}>
          <article className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-background px-14 py-18 text-center">
            <CountUpNumberAnimation
              to={35}
              duration={3}
              suffix="%"
              className="text-5xl font-semibold tracking-tight text-foreground md:text-6xl"
            />
            <p className="mt-4 text-lg text-muted-foreground">{t("stats.repProductivity")}</p>
          </article>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation className="sm:col-span-1 lg:col-span-3" delay={0.25}>
          <article className="flex h-full flex-col items-center justify-center rounded-xl border border-primary/40 bg-primary px-14 py-18 text-center text-primary-foreground">
            <CountUpNumberAnimation
              to={45}
              prefix="$"
              suffix="M"
              duration={3}
              className="text-5xl font-semibold tracking-tight md:text-6xl"
            />
            <p className="mt-4 text-lg text-primary-foreground/90">{t("stats.revenueBoostPerYear")}</p>
          </article>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation className="sm:col-span-2 lg:col-span-6" delay={0.3}>
          <article className="h-full rounded-xl border border-border bg-background p-8">
            <p className="text-xl leading-relaxed text-foreground md:text-2xl">
              {t("quotes.quoteTwoText")}
            </p>
            <div className="mt-8">
              <p className="text-lg font-semibold text-foreground">{t("quotes.quoteTwoAuthor")}</p>
              <p className="text-sm text-muted-foreground">{t("quotes.quoteTwoRole")}</p>
            </div>
          </article>
        </BottomUpFadeAnimation>
      </div>
    </section>
  )
}
