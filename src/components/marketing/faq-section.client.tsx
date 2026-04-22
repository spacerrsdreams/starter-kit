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
    answer:
      "Yes, Salix supports common CRM workflows and integrations to keep your pipeline and customer data in sync.",
  },
  {
    id: "sales-goals",
    question: "Can I track sales goals?",
    answer:
      "Absolutely. You can set targets, monitor performance in real time, and review progress across teams and reps.",
  },
] as const

export function FaqSectionClient() {
  return (
    <section className="w-full px-8 py-14 md:py-20">
      <div className="mx-auto grid max-w-5xl md:grid-cols-[50%_50%]">
        <div className="space-y-6">
          <Chip Icon={CircleHelp} title="FAQ" />
          <h2 className="text-2xl font-semibold tracking-tighter text-foreground md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-foreground/80">Get answers to common questions here</p>
        </div>

        <Accordion type="single" collapsible defaultValue="data-safety" className="space-y-3">
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
      </div>
    </section>
  )
}
