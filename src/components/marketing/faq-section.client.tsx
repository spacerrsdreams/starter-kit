"use client"

import { CircleHelp } from "lucide-react"
import { useTranslations } from "next-intl"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"
import { Chip } from "@/components/ui/chip"

export function FaqSectionClient() {
  const t = useTranslations("home.faq")
  const faqItems = [
    {
      id: "data-safety",
      question: t("items.dataSafety.question"),
      answer: t("items.dataSafety.answer"),
    },
    {
      id: "getting-started",
      question: t("items.gettingStarted.question"),
      answer: t("items.gettingStarted.answer"),
    },
    {
      id: "crm-compatibility",
      question: t("items.crmCompatibility.question"),
      answer: t("items.crmCompatibility.answer"),
    },
    {
      id: "sales-goals",
      question: t("items.salesGoals.question"),
      answer: t("items.salesGoals.answer"),
    },
  ] as const

  return (
    <section className="w-full px-4 py-20 pb-8 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:gap-10">
        <BottomUpFadeAnimation>
          <div className="min-w-0">
            <div className="flex justify-center lg:justify-start">
              <Chip Icon={CircleHelp} title={t("chip")} />
            </div>
            <div className="space-y-2 pt-6 lg:space-y-6">
              <h2 className="text-center text-2xl font-semibold tracking-[-2.5px] text-foreground md:text-5xl lg:text-start">
                {t("title")}
              </h2>
              <p className="text-center text-base text-foreground/80 lg:text-start">
                {t("description")}
              </p>
            </div>
          </div>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation delay={0.08}>
          <Accordion type="single" collapsible defaultValue="data-safety" className="min-w-0 space-y-3">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="rounded-xl border border-border/70 px-4 py-2 transition-colors duration-200 data-[state=open]:bg-secondary/80"
              >
                <AccordionTrigger className="text-lg font-medium">{item.question}</AccordionTrigger>
                <AccordionContent className="text-base">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </BottomUpFadeAnimation>
      </div>
    </section>
  )
}
