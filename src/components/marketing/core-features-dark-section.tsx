import { Activity, BadgeDollarSign, Cpu, Gamepad2, Rocket, ShieldCheck, Workflow, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { SiteConfig } from "@/lib/site.config"
import { CoreFeaturesLeftBorderGlow } from "@/components/marketing/core-features-left-border-glow"
import { SectionHeading } from "@/components/section-heading"
import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"

import { AnimatedSvg } from "../motion/animated-svg.animation"

export function CoreFeaturesDarkSection() {
  const t = useTranslations("home.coreFeatures")
  const coreFeaturesItems: Array<{
    title: string
    description: string
    Icon: LucideIcon
  }> = [
    {
      title: t("items.salesGoalTracking.title"),
      description: t("items.salesGoalTracking.description"),
      Icon: Cpu,
    },
    {
      title: t("items.priceManagement.title"),
      description: t("items.priceManagement.description"),
      Icon: BadgeDollarSign,
    },
    {
      title: t("items.salesGamification.title"),
      description: t("items.salesGamification.description"),
      Icon: Gamepad2,
    },
    {
      title: t("items.smartForecasting.title"),
      description: t("items.smartForecasting.description"),
      Icon: Activity,
    },
    {
      title: t("items.salesWorkflows.title"),
      description: t("items.salesWorkflows.description"),
      Icon: Workflow,
    },
    {
      title: t("items.accessControl.title"),
      description: t("items.accessControl.description"),
      Icon: ShieldCheck,
    },
  ]

  return (
    <section className="w-full overflow-hidden px-4 lg:px-8">
      <div className="rounded-3xl bg-[rgb(24,24,24)]">
        <div className="relative container mx-auto overflow-hidden border border-r border-l border-border/5 px-6 py-12 md:px-10 md:py-30">
          <CoreFeaturesLeftBorderGlow />
          <BottomUpFadeAnimation>
            <SectionHeading
              className="mx-auto max-w-3xl"
              chipIcon={Rocket}
              chipText={t("chip")}
              chipVariant="dark"
              title={t("title", { name: SiteConfig.name })}
              description={t("description")}
              titleClassName="text-2xl font-semibold text-zinc-100 md:text-4xl"
              descriptionClassName="max-w-sm text-background/80"
            />
          </BottomUpFadeAnimation>

          <div className="mx-auto mt-18 grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coreFeaturesItems.map(({ title, description, Icon }, index) => (
              <BottomUpFadeAnimation key={title} delay={0.08 + index * 0.06}>
                <article className="rounded-xl border border-border/5 p-6">
                  <AnimatedSvg>
                    <Icon className="size-12 text-accent-1" />
                  </AnimatedSvg>
                  <h3 className="mt-7 text-xl font-semibold tracking-[-2px] text-zinc-100">{title}</h3>
                  <p className="mt-3 text-base text-zinc-400">{description}</p>
                </article>
              </BottomUpFadeAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
