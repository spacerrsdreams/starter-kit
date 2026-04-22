"use client"

import { Sparkles } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"
import { Chip } from "@/components/ui/chip"

import { Separator } from "../ui/separator"

const keyToolsSections = [
  {
    id: "sales-automation",
    navTitle: "Sales Automation",
    title: "Sales Automation",
    description:
      "Automate repetitive tasks like follow-ups, reminders, and data entry to save time and increase efficiency.",
  },
  {
    id: "deal-tracking",
    navTitle: "Deal Tracking",
    title: "Deal Tracking",
    description: "Track every opportunity stage with a clean view of value, probability, and progress in one place.",
  },
  {
    id: "crm-integration",
    navTitle: "CRM Integration",
    title: "CRM Integration",
    description:
      "Connect your CRM and keep customer context synced across sales workflows without extra manual updates.",
  },
] as const

export function KeyToolsScrollClient() {
  const [activeSectionId, setActiveSectionId] = useState<string>(keyToolsSections[0].id)
  const sectionRefs = useRef<Array<HTMLElement | null>>([])

  const sectionIndexById = useMemo(() => {
    return new Map(keyToolsSections.map((section, index) => [section.id, index]))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const mostVisibleEntry = visibleEntries[0]
        if (!mostVisibleEntry) {
          return
        }

        const id = mostVisibleEntry.target.getAttribute("data-tool-id")
        if (!id) {
          return
        }

        setActiveSectionId(id)
      },
      {
        root: null,
        rootMargin: "-25% 0px -35% 0px",
        threshold: [0.2, 0.4, 0.6, 0.8],
      }
    )

    sectionRefs.current.forEach((sectionRef) => {
      if (sectionRef) {
        observer.observe(sectionRef)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="mx-auto w-full max-w-5xl py-12 pb-28 md:pt-24">
      <div className="grid gap-4 lg:grid-cols-[40%_60%] lg:gap-12">
        <BottomUpFadeAnimation delay={0.05}>
          <aside className="h-fit lg:sticky lg:top-24">
            <Chip Icon={Sparkles} title="Key Tools" />
            <h2 className="mt-6 text-3xl leading-[1.05] font-semibold text-foreground/95 md:text-5xl">
              AI that moves sales forward & faster
            </h2>

            <nav className="mt-10 space-y-5">
              {keyToolsSections.map((section) => {
                const isActive = activeSectionId === section.id
                return (
                  <div key={section.id} className="relative pl-4">
                    <span
                      className={`absolute top-1/2 left-0 h-7 w-[2px] -translate-y-1/2 transition-colors ${
                        isActive ? "bg-primary" : "bg-transparent"
                      }`}
                    />
                    <p
                      className={`text-xl font-medium tracking-tight transition-colors ${isActive ? "text-primary" : "text-foreground/80"}`}
                    >
                      {section.navTitle}
                    </p>
                  </div>
                )
              })}
            </nav>
          </aside>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation delay={0.2}>
          <div className="space-y-24 pt-6 md:space-y-28 lg:pt-50">
            {keyToolsSections.map((section, idx) => {
              const sectionIndex = sectionIndexById.get(section.id) ?? 0

              return (
                <div key={section.id} className="mb-12 scroll-mt-28 space-y-12">
                  <article
                    data-tool-id={section.id}
                    ref={(element) => {
                      sectionRefs.current[sectionIndex] = element
                    }}
                    className="space-y-5"
                  >
                    <div className="space-y-3">
                      <h3 className="text-3xl font-medium text-foreground">{section.title}</h3>
                      <p className="text-lg leading-relaxed text-foreground/80">{section.description}</p>
                    </div>

                    <div className="rounded-md border border-border/70 bg-secondary/80 p-4">
                      <div className="size-full rounded-md border border-border/70 bg-white">
                        <div className="flex min-h-54 items-center justify-center text-sm font-semibold">
                          <p>@Spacerr</p>
                        </div>
                      </div>
                    </div>
                  </article>
                  {idx !== keyToolsSections.length - 1 && <Separator className="bg-border/70" />}
                </div>
              )
            })}
          </div>
        </BottomUpFadeAnimation>
      </div>
    </section>
  )
}
