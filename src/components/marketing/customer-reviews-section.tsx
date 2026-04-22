import { MessageCircle } from "lucide-react"

import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"
import { Chip } from "@/components/ui/chip"

export function CustomerReviewsSection() {
  return (
    <section className="w-full px-8 py-14 md:py-20">
      <BottomUpFadeAnimation>
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Chip Icon={MessageCircle} title="Customer Reviews" />
          <h2 className="mt-6 text-3xl font-semibold tracking-tighter text-foreground md:text-5xl">
            Trusted by 2500+ growing companies worldwide
          </h2>
        </div>
      </BottomUpFadeAnimation>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-12">
        <BottomUpFadeAnimation delay={0.05}>
          <article className="rounded-2xl border border-border/70 bg-pink-500 p-8 text-white md:col-span-3">
            <p className="text-6xl font-semibold tracking-tight">60%</p>
            <p className="mt-4 text-lg text-white/90">Admin work reduced</p>
          </article>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation delay={0.1}>
          <article className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-zinc-100 md:col-span-6">
            <p className="text-2xl leading-relaxed">
              &quot;Salix cut our admin work by more than half. Our team now spends more time closing deals than
              managing spreadsheets.&quot;
            </p>
            <div className="mt-8">
              <p className="text-lg font-semibold">Shon Taite</p>
              <p className="text-sm text-zinc-400">Head of Sales, Grainor</p>
            </div>
          </article>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation delay={0.15}>
          <article className="rounded-2xl border border-border/70 bg-card p-8 md:col-span-3">
            <p className="text-6xl font-semibold tracking-tight text-foreground">45%</p>
            <p className="mt-4 text-lg text-muted-foreground">Revenue boost per year</p>
          </article>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation delay={0.2}>
          <article className="rounded-2xl border border-border/70 bg-card p-8 md:col-span-3">
            <p className="text-6xl font-semibold tracking-tight text-foreground">35%</p>
            <p className="mt-4 text-lg text-muted-foreground">Rep productivity</p>
          </article>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation delay={0.25}>
          <article className="rounded-2xl border border-blue-500/70 bg-blue-600 p-8 text-white md:col-span-3">
            <p className="text-6xl font-semibold tracking-tight">$45M</p>
            <p className="mt-4 text-lg text-white/90">Revenue boost per year</p>
          </article>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation delay={0.3}>
          <article className="rounded-2xl border border-border/70 bg-card p-8 md:col-span-6">
            <p className="text-2xl leading-relaxed text-foreground">
              &quot;Salix isn&apos;t just software - it feels like an extension of our sales team. We&apos;re more
              organized, focused, and efficient.&quot;
            </p>
            <div className="mt-8">
              <p className="text-lg font-semibold text-foreground">Mark Demon</p>
              <p className="text-sm text-muted-foreground">Co-founder at RevBoost</p>
            </div>
          </article>
        </BottomUpFadeAnimation>
      </div>
    </section>
  )
}
