import { Rocket } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

import { SiteConfig } from "@/lib/site.config"
import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"
import { SectionHeading } from "@/components/section-heading"

const previewChartBars = [
  { width: "w-[64%]", color: "bg-emerald-500", label: "40%" },
  { width: "w-[88%]", color: "bg-accent-1", label: "80%" },
  { width: "w-[50%]", color: "bg-primary", label: "20%" },
] as const

type TaskRow = {
  title: string
  time: string
}

type PreviewLegend = {
  label: string
  color: string
}

function TaskPreviewCard({ taskPreviewRows, title }: { taskPreviewRows: readonly TaskRow[]; title: string }) {
  return (
    <div className="h-full overflow-hidden rounded-lg border border-border/70 bg-secondary/80 p-4">
      <div className="mb-6 text-sm font-medium text-foreground/80">{title}</div>
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

function TrafficPreviewCard({ title, previewLegend }: { title: string; previewLegend: readonly PreviewLegend[] }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-secondary/80 p-4">
      <div className="text-sm font-medium text-foreground/80">{title}</div>
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

function SalesPreviewCard({ alt }: { alt: string }) {
  return (
    <div className="h-full overflow-hidden rounded-lg border border-border/70 bg-secondary/80">
      <Image
        src="/assets/statistics.webp"
        alt={alt}
        width={800}
        height={640}
        className="h-full w-full object-cover object-center"
      />
    </div>
  )
}

function PreviewByIndex({
  index,
  taskPreviewRows,
  taskCardTitle,
  trafficCardTitle,
  previewLegend,
  salesPreviewAlt,
}: {
  index: number
  taskPreviewRows: readonly TaskRow[]
  taskCardTitle: string
  trafficCardTitle: string
  previewLegend: readonly PreviewLegend[]
  salesPreviewAlt: string
}) {
  if (index === 0)
    return (
      <div className="flex-1">
        <TaskPreviewCard taskPreviewRows={taskPreviewRows} title={taskCardTitle} />
      </div>
    )

  if (index === 1)
    return (
      <div className="flex-1">
        <TrafficPreviewCard title={trafficCardTitle} previewLegend={previewLegend} />
      </div>
    )

  return (
    <div className="flex-1">
      <SalesPreviewCard alt={salesPreviewAlt} />
    </div>
  )
}

export function WhyChooseSection() {
  const t = useTranslations("home.whyChoose")
  const whyChooseCards = [
    {
      title: t("cards.taskTracking.title"),
      description: t("cards.taskTracking.description"),
    },
    {
      title: t("cards.realTimeVisits.title"),
      description: t("cards.realTimeVisits.description"),
    },
    {
      title: t("cards.reportingAnalytics.title"),
      description: t("cards.reportingAnalytics.description"),
    },
  ] as const
  const previewLegend = [
    { label: t("previewLegend.google"), color: "bg-emerald-500" },
    { label: t("previewLegend.facebook"), color: "bg-accent-1" },
    { label: t("previewLegend.x"), color: "bg-primary" },
  ] as const
  const taskPreviewRows = [
    { title: t("taskRows.designingTeamMeeting"), time: "09AM - 10AM" },
    { title: t("taskRows.webflowTeam"), time: "08AM - 11AM" },
    { title: t("taskRows.framerTeam"), time: "11AM - 12AM" },
  ] as const

  return (
    <section className="mx-auto mt-20 w-full max-w-5xl py-6 md:py-10">
      <BottomUpFadeAnimation>
        <SectionHeading
          chipIcon={Rocket}
          chipText={t("chip")}
          title={t("title", { name: SiteConfig.name })}
          description={t("description", { name: SiteConfig.name })}
          descriptionClassName="max-w-xs text-muted-foreground md:max-w-2xl"
        />
      </BottomUpFadeAnimation>

      <div className="mt-10 grid gap-6 px-4 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3 lg:px-0">
        {whyChooseCards.map((card, index) => (
          <BottomUpFadeAnimation key={card.title} delay={0.1 + index * 0.12} className="h-full">
            <article className="flex h-full flex-col gap-4">
              <PreviewByIndex
                index={index}
                taskPreviewRows={taskPreviewRows}
                taskCardTitle={t("tasksCardTitle")}
                trafficCardTitle={t("trafficCardTitle")}
                previewLegend={previewLegend}
                salesPreviewAlt={t("salesPreviewAlt")}
              />
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
