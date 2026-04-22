import {
  Activity,
  BadgeDollarSign,
  Cpu,
  Gamepad2,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react"

import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"
import { Chip } from "@/components/ui/chip"

const insideSalixItems: Array<{
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

export function InsideSalixSection() {
  return (
    <section className="w-full px-8 py-14 md:py-20">
      <BottomUpFadeAnimation>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Chip Icon={Cpu} title="Core Features" />
          <h2 className="mt-6 text-3xl font-semibold tracking-tighter text-foreground md:text-5xl">
            What&apos;s inside Salix?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Businesses choose Salix because it simplifies the complexity of sales management.
          </p>
        </div>
      </BottomUpFadeAnimation>

      <div className="mt-10 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
        {insideSalixItems.map(({ title, description, Icon }, index) => (
          <BottomUpFadeAnimation key={title} delay={0.1 + index * 0.08}>
            <article className="rounded-xl border border-border/70 bg-card/40 p-6">
              <Icon className="size-8 text-pink-500" />
              <h3 className="mt-7 text-2xl font-semibold tracking-tight text-foreground">{title}</h3>
              <p className="mt-3 text-base text-muted-foreground">{description}</p>
            </article>
          </BottomUpFadeAnimation>
        ))}
      </div>
    </section>
  )
}
