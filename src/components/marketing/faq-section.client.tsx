"use client"

import { CircleHelp } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Chip } from "@/components/ui/chip"

const faqItems = [
  {
    id: "data-safety",
    question: "Is my data safe on Salix?",
    answer:
      "Yes. We use industry-grade encryption, secure servers, and role-based access controls to protect your data at all times.",
  },
  {
    id: "getting-started",
    question: "How do I get started?",
    answer: "Sign up for a trial, connect your sales workspace, and follow the onboarding steps to go live in minutes.",
  },
  {
    id: "crm-compatibility",
    question: "Does it work with my CRM?",
    answer: "Yes, Salix supports common CRM workflows and integrations to keep your pipeline and customer data in sync.",
  },
  {
    id: "sales-goals",
    question: "Can I track sales goals?",
    answer: "Absolutely. You can set targets, monitor performance in real time, and review progress across teams and reps.",
  },
] as const

export function FaqSectionClient() {
  return (
    <section className="w-full px-8 py-14 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[42%_58%] md:gap-12">
        <div className="space-y-6">
          <Chip Icon={CircleHelp} title="FAQ" />
          <h2 className="text-4xl font-semibold tracking-tighter text-foreground md:text-6xl">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">Get answers to common questions here</p>
        </div>

        <Accordion type="single" collapsible defaultValue="data-safety" className="space-y-3">
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="rounded-2xl border border-border/70 bg-card px-5">
              <AccordionTrigger className="py-5 text-2xl font-semibold text-foreground hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-lg leading-relaxed text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
