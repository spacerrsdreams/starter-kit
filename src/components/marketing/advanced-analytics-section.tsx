import { BarChart3 } from "lucide-react"

import { cn } from "@/lib/utils"
import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"
import { Chip } from "@/components/ui/chip"

import { AnimatedSvg } from "../ui/animated-svg.animation"

const analyticsPills = ["Integrated Payment", "Authorization", "Just ready AI"] as const

export function AdvancedAnalyticsSection() {
  return (
    <section className="w-full px-8 py-14 md:py-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <BottomUpFadeAnimation>
          <AnimatedSvg>
            <Chip Icon={BarChart3} title="Growth Gear" />
          </AnimatedSvg>
          <h2 className="mt-6 text-3xl font-medium text-foreground md:text-5xl">Advanced analytics &amp; reporting</h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Businesses choose Salix because it simplifies the complexity of sales management.
          </p>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation delay={0.08}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {analyticsPills.map((pill, index) => (
              <div
                key={pill}
                className={cn(
                  "rounded-full border px-5 py-2 text-base font-medium",
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
          <div className="size-full rounded-xl border border-border/70 bg-white">
            <div className="flex min-h-120 items-center justify-center text-sm font-semibold">
              <p>@Spacerr</p>
            </div>
          </div>
        </div>
      </BottomUpFadeAnimation>
    </section>
  )
}
