import { Rocket } from "lucide-react"
import Image from "next/image"

import { SiteConfig } from "@/lib/site.config"
import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"
import { Chip } from "@/components/ui/chip"

const whyChooseCards = [
  {
    title: "Task & Activity Tracking",
    description: "Assign tasks, schedule meetings and track team activities in one clean workflow.",
  },
  {
    title: "Real-Time Visits",
    description: "Generate detailed reports on sales performance and team productivity instantly.",
  },
  {
    title: "Reporting & Analytics",
    description: "Enable seamless communication and file sharing among sales reps.",
  },
] as const

const previewChartBars = [
  { width: "w-[64%]", color: "bg-emerald-500", label: "40%" },
  { width: "w-[88%]", color: "bg-accent-1", label: "80%" },
  { width: "w-[50%]", color: "bg-primary", label: "20%" },
] as const

const previewLegend = [
  { label: "Google", color: "bg-emerald-500" },
  { label: "Facebook", color: "bg-accent-1" },
  { label: "X", color: "bg-primary" },
] as const

const taskPreviewRows = [
  { title: "Designing team meeting", time: "09AM - 10AM" },
  { title: "Webflow Team", time: "08AM - 11AM" },
  { title: "Framer Team", time: "11AM - 12AM" },
] as const

function TaskPreviewCard() {
  return (
    <div className="h-full overflow-hidden rounded-lg border border-border/70 bg-secondary/80 p-4">
      <div className="mb-6 text-sm font-medium text-foreground/80">Today&apos;s Task</div>
      <div className="space-y-3">
        {taskPreviewRows.map((row) => (
          <div key={row.title} className="rounded-sm border border-border/70 bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-medium text-zinc-800">{row.title}</div>
              <div className="flex items-center">
                <div className="mr-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] text-white">
                  +
                </div>
                <div className="flex -space-x-1.5">
                  <span className="h-4 w-4 rounded-full border border-zinc-50 bg-zinc-300" />
                  <span className="h-4 w-4 rounded-full border border-zinc-50 bg-zinc-400" />
                  <span className="h-4 w-4 rounded-full border border-zinc-50 bg-zinc-500" />
                </div>
              </div>
            </div>
            <div className="mt-1 text-[11px] text-zinc-600">{row.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrafficPreviewCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-secondary/80 p-4">
      <div className="text-sm font-medium text-foreground/80">Traffic</div>
      <div className="flex flex-1 items-center justify-center py-3">
        <div className="relative w-full max-w-[280px] rounded-xl px-0 pt-2">
          <div className="absolute inset-y-0 right-0 left-0 grid grid-cols-6 gap-0">
            {Array.from({ length: 6 }).map((_, gridIndex) => (
              <div
                key={gridIndex}
                className="border-r border-dashed border-zinc-300/80 first:border-l first:border-dashed first:border-zinc-300/80"
              />
            ))}
          </div>
          <div className="relative space-y-5">
            {previewChartBars.map((bar) => (
              <div
                key={bar.label}
                className={`h-6 rounded-[4px] ${bar.width} ${bar.color} flex items-center justify-end p-0.5`}
              >
                <div className="rounded-sm border border-zinc-300 bg-zinc-50 px-1.5 py-px pr-2 text-[9px] font-medium text-zinc-800">
                  {bar.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
        {previewLegend.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SalesPreviewCard() {
  return (
    <div className="h-full overflow-hidden rounded-lg border border-border/70 bg-secondary/80">
      <Image
        src="/assets/statistics.webp"
        alt="Sales overview statistics"
        width={800}
        height={640}
        className="h-full w-full object-cover object-center"
      />
    </div>
  )
}

function PreviewByIndex({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="flex-1">
        <TaskPreviewCard />
      </div>
    )

  if (index === 1)
    return (
      <div className="flex-1">
        <TrafficPreviewCard />
      </div>
    )

  return (
    <div className="flex-1">
      <SalesPreviewCard />
    </div>
  )
}

export function WhyChooseSection() {
  return (
    <section className="mx-auto mt-20 w-full max-w-5xl py-6 md:py-10">
      <BottomUpFadeAnimation>
        <div className="flex flex-col items-center text-center">
          <Chip Icon={Rocket} title="Power Pack" />
          <h2 className="mt-6 text-3xl font-medium tracking-[-2.5px] text-foreground md:text-4xl">
            Why businesses choose {SiteConfig.name}
          </h2>
          <p className="mt-4 max-w-xs text-muted-foreground md:max-w-2xl">
            Businesses choose {SiteConfig.name} because it simplifies the complexity of sales management.
          </p>
        </div>
      </BottomUpFadeAnimation>

      <div className="mt-10 grid gap-6 px-4 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3 lg:px-0">
        {whyChooseCards.map((card, index) => (
          <BottomUpFadeAnimation key={card.title} delay={0.1 + index * 0.12} className="h-full">
            <article className="flex h-full flex-col gap-4">
              <PreviewByIndex index={index} />
              <div className="space-y-2 px-1">
                <h3 className="text-lg font-semibold tracking-tighter text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            </article>
          </BottomUpFadeAnimation>
        ))}
      </div>
    </section>
  )
}
