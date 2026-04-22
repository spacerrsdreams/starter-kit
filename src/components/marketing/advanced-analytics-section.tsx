import { BarChart3 } from "lucide-react"

import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"
import { Chip } from "@/components/ui/chip"

const analyticsPills = ["Meeting Scheduler", "Territory Management", "Lead Enrichment"] as const

export function AdvancedAnalyticsSection() {
  return (
    <section className="w-full px-8 py-14 md:py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <BottomUpFadeAnimation>
          <Chip Icon={BarChart3} title="Growth Gear" />
          <h2 className="mt-6 text-3xl font-semibold tracking-tighter text-foreground md:text-5xl">
            Advanced analytics &amp; reporting
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Businesses choose Salix because it simplifies the complexity of sales management.
          </p>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation delay={0.08}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {analyticsPills.map((pill, index) => (
              <div
                key={pill}
                className={`rounded-full border px-5 py-2 text-sm font-medium ${
                  index === 0
                    ? "border-cyan-400 bg-cyan-100/70 text-foreground"
                    : "border-border/70 bg-secondary/70 text-foreground/90"
                }`}
              >
                {pill}
              </div>
            ))}
          </div>
        </BottomUpFadeAnimation>
      </div>

      <BottomUpFadeAnimation delay={0.15}>
        <div className="mx-auto mt-8 max-w-5xl rounded-3xl border border-border/70 bg-card/40 p-4 md:p-5">
          <div className="size-full rounded-2xl border border-border/70 bg-secondary/80 p-4 md:p-6">
            <div className="size-full rounded-xl border border-border/70 bg-white">
              <div className="flex min-h-72 items-center justify-center text-sm font-semibold">
                <p>@Spacerr</p>
              </div>
            </div>
          </div>
        </div>
      </BottomUpFadeAnimation>
    </section>
  )
}
