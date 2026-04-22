import { Activity, BadgeDollarSign, Cpu, Gamepad2, Rocket, ShieldCheck, Workflow, type LucideIcon } from "lucide-react"

import { CoreFeaturesLeftBorderGlow } from "@/components/marketing/core-features-left-border-glow.client"
import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"
import { Chip } from "@/components/ui/chip"

import { AnimatedSvg } from "../ui/animated-svg.animation"

const coreFeaturesItems: Array<{
  title: string
  description: string
  Icon: LucideIcon
}> = [
  {
    title: "Sales Goal Tracking",
    description: "Sales Goal Tracking helps teams stay aligned, focused",
    Icon: Cpu,
  },
  {
    title: "Price Management",
    description: "Price management helps adjust and control pricing strategies",
    Icon: BadgeDollarSign,
  },
  {
    title: "Sales Gamification",
    description: "Sales gamification is the use of game-like elements",
    Icon: Gamepad2,
  },
  {
    title: "Smart Forecasting",
    description: "Smart Forecasting uses real-time data and AI to predict future",
    Icon: Activity,
  },
  {
    title: "Sales Workflows",
    description: "Sales workflows are structured processes that guide your",
    Icon: Workflow,
  },
  {
    title: "Access Control",
    description: "Access control ensures that only the right people can view",
    Icon: ShieldCheck,
  },
]

export function CoreFeaturesDarkSection() {
  return (
    <section className="w-full px-8">
      <div className="rounded-3xl bg-[rgb(24,24,24)]">
        <div className="relative mx-auto max-w-[1200px] overflow-hidden border border-r border-l border-border/5 px-6 py-12 md:px-10 md:py-30">
          <CoreFeaturesLeftBorderGlow />
          <BottomUpFadeAnimation>
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <Chip Icon={Rocket} title="Core Features" variant="dark" size="lg" />
              <h2 className="mt-6 text-2xl font-semibold tracking-[-3px] text-zinc-100 md:text-4xl">
                What&apos;s inside Salix?
              </h2>
              <p className="mt-4 max-w-sm text-background/80">
                Businesses choose Salix because it simplifies the complexity of sales management.
              </p>
            </div>
          </BottomUpFadeAnimation>

          <div className="mx-auto mt-18 grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coreFeaturesItems.map(({ title, description, Icon }, index) => (
              <BottomUpFadeAnimation key={title} delay={0.08 + index * 0.06}>
                <article className="rounded-xl border border-border/5 p-6">
                  <AnimatedSvg duration={1} repeatIn={5}>
                    <Icon className="size-12 text-accent-1" />
                  </AnimatedSvg>
                  <h3 className="mt-7 text-xl font-semibold text-zinc-100">{title}</h3>
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
