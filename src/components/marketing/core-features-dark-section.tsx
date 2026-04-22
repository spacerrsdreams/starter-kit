import { Activity, BadgeDollarSign, Cpu, Gamepad2, ShieldCheck, Workflow, type LucideIcon } from "lucide-react"

import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"
import { Chip } from "@/components/ui/chip"

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
    <section className="w-full rounded-3xl bg-[rgb(24,24,24)] px-8">
      <div className="mx-auto max-w-[1200px] border border-r border-l border-border/5 px-6 py-12 md:px-10 md:py-16">
        <BottomUpFadeAnimation>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Chip Icon={Cpu} title="Core Features" />
            <h2 className="mt-6 text-3xl font-semibold tracking-tighter text-zinc-100 md:text-5xl">
              What&apos;s inside Salix?
            </h2>
            <p className="mt-4 max-w-2xl text-zinc-400">
              Businesses choose Salix because it simplifies the complexity of sales management.
            </p>
          </div>
        </BottomUpFadeAnimation>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coreFeaturesItems.map(({ title, description, Icon }, index) => (
            <BottomUpFadeAnimation key={title} delay={0.08 + index * 0.06}>
              <article className="rounded-xl border border-border/5 p-6">
                <Icon className="size-8 text-accent-1" />
                <h3 className="mt-7 text-2xl font-semibold tracking-tight text-zinc-100">{title}</h3>
                <p className="mt-3 text-base text-zinc-400">{description}</p>
              </article>
            </BottomUpFadeAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
