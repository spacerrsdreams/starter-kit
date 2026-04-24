"use client"

import { Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

import { SiteConfig } from "@/lib/site.config"
import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"
import { Chip } from "@/components/ui/chip"

import { Separator } from "../ui/separator"

export function KeyToolsScrollClient() {
  const t = useTranslations("home.keyTools")
  const keyToolsSections = [
    {
      id: "sales-automation",
      navTitle: t("sections.salesAutomation.navTitle"),
      title: t("sections.salesAutomation.title"),
      description: t("sections.salesAutomation.description"),
    },
    {
      id: "deal-tracking",
      navTitle: t("sections.dealTracking.navTitle"),
      title: t("sections.dealTracking.title"),
      description: t("sections.dealTracking.description"),
    },
    {
      id: "crm-integration",
      navTitle: t("sections.crmIntegration.navTitle"),
      title: t("sections.crmIntegration.title"),
      description: t("sections.crmIntegration.description"),
    },
  ] as const

  const [activeSectionId, setActiveSectionId] = useState<string>(keyToolsSections[0].id)
  const sectionRefs = useRef<Array<HTMLElement | null>>([])

  const sectionIndexById = new Map(keyToolsSections.map((section, index) => [section.id, index]))

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
    <section className="mx-auto w-full max-w-5xl py-12 pb-0 md:pt-24 md:pb-20 lg:pb-28">
      <div className="grid gap-4 lg:grid-cols-[40%_60%] lg:gap-12">
        <BottomUpFadeAnimation delay={0.05}>
          <aside className="h-fit px-4 lg:sticky lg:top-24 lg:px-0">
            <div className="flex justify-center lg:justify-start">
              <Chip Icon={Sparkles} title={t("chip")} />
            </div>
            <h2 className="mt-6 text-center text-3xl font-medium tracking-[-2.5px] text-foreground/95 md:text-5xl lg:text-start">
              {t("title")}
            </h2>

            <nav className="mt-10 hidden space-y-5 lg:block">
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
          <div className="space-y-24 px-4 pt-6 md:space-y-28 lg:px-0 lg:pt-50">
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
                      <h3 className="text-xl font-medium tracking-[-2px] text-foreground lg:text-3xl">
                        {section.title}
                      </h3>
                      <p className="text-base leading-relaxed text-foreground/80 lg:text-lg">{section.description}</p>
                    </div>

                    <div className="rounded-md border border-border/70 bg-secondary/80 p-4">
                      <div className="size-full rounded-md border border-border/70 bg-white">
                        <div className="flex min-h-54 items-center justify-center text-sm font-semibold">
                          <p>{t("previewHandle", { name: SiteConfig.name })}</p>
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
