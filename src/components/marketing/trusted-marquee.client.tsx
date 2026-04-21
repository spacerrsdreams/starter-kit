"use client"

import { motion } from "motion/react"

import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"

const trustedCompanies = [
  { name: "Fyntra", logo: "FD", colorClass: "text-orange-500" },
  { name: "Nexora", logo: "NX", colorClass: "text-rose-500" },
  { name: "Fluxenta", logo: "FX", colorClass: "text-emerald-500" },
  { name: "Veltriq", logo: "VQ", colorClass: "text-blue-500" },
  { name: "Aurevia", logo: "AV", colorClass: "text-violet-500" },
] as const

export function TrustedMarqueeClient() {
  const marqueeItems = [...trustedCompanies, ...trustedCompanies]

  return (
    <BottomUpFadeAnimation>
      <section className="mx-auto mt-60 w-full max-w-5xl overflow-hidden border-t border-b border-border/50 py-10 md:py-16">
        <p className="px-4 text-center text-sm font-semibold text-foreground/80 md:text-base">
          Trusted by 17,000+ founders & business owners
        </p>

        <div className="relative mt-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent" />

          <motion.div
            className="flex w-max items-center gap-14 px-4 md:gap-20"
            animate={{ transform: ["translateX(0%)", "translateX(-50%)"] }}
            transition={{
              duration: 24,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {marqueeItems.map((company, index) => (
              <div key={`${company.name}-${index}`} className="flex shrink-0 items-center gap-3">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold ${company.colorClass}`}
                >
                  {company.logo}
                </span>
                <span className="text-2xl font-semibold tracking-tight text-foreground/90">{company.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </BottomUpFadeAnimation>
  )
}
