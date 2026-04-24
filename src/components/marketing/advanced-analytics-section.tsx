import { Rocket } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"
import { Chip } from "@/components/ui/chip"

export function AdvancedAnalyticsSection() {
  const t = useTranslations("home.analytics")
  const analyticsPills = [t("pills.integratedPayment"), t("pills.authorization"), t("pills.justReadyAi")]

  return (
    <section className="w-full px-4 py-14 md:py-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <BottomUpFadeAnimation>
          <Chip Icon={Rocket} title={t("chip")} />
          <h2 className="mt-6 text-3xl font-medium tracking-[-2.5px] text-foreground md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-foreground/80">{t("description")}</p>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation delay={0.08}>
          <div className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {analyticsPills.map((pill, index) => (
              <div
                key={pill}
                className={cn(
                  "w-full rounded-full border px-5 py-2 text-center text-base font-medium",
                  index === 0 && "border-cyan-400 bg-cyan-100/70 text-foreground",
                  index !== 0 && "border-border/70 bg-secondary/70 text-foreground/90"
                )}
              >
                {pill}
              </div>
            ))}
          </div>
        </BottomUpFadeAnimation>
      </div>

      <BottomUpFadeAnimation delay={0.15}>
        <div className="mx-auto mt-8 size-full max-w-4xl rounded-2xl bg-secondary/80 p-4">
          <div className="size-full rounded-xl border bg-white">
            <div className="flex min-h-60 items-center justify-center text-sm font-semibold md:min-h-80 lg:min-h-120">
              <p>{t("previewHandle")}</p>
            </div>
          </div>
        </div>
      </BottomUpFadeAnimation>
    </section>
  )
}
