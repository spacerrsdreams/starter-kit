"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type PricingPlanCardProps = {
  title: string
  subtitle: string
  price: number
  billedLabel: string
  features: string[]
  ctaLabel: string
  isLoading: boolean
  onSelect: () => void
  isFeatured?: boolean
  isLastFeatureMuted?: boolean
}

export function PricingPlanCard({
  title,
  subtitle,
  price,
  billedLabel,
  features,
  ctaLabel,
  isLoading,
  onSelect,
  isFeatured = false,
  isLastFeatureMuted = false,
}: PricingPlanCardProps) {
  const ctaText = isLoading ? "Opening..." : ctaLabel
  const slideTransition = {
    type: "tween" as const,
    duration: 0.85,
    ease: [0.22, 1, 0.36, 1] as const,
  }
  const ctaLineClass = "flex h-5 min-h-5 w-full shrink-0 items-center justify-center whitespace-nowrap leading-none"

  return (
    <div
      className={cn(
        "relative w-90 max-w-90 overflow-hidden rounded-lg bg-sidebar px-10 py-8",
        isFeatured ? "border-2 border-black" : "border"
      )}
    >
      {isFeatured ? (
        <span className="absolute top-0 right-0 rounded-bl-md bg-primary p-2.5 text-xs! font-medium text-white">
          MOST POPULAR
        </span>
      ) : null}

      <div className="space-y-1.5">
        <p className="text-lg leading-none font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <p className="mt-6 space-x-1 leading-none font-medium">
        <span className="align-baseline text-4xl">${price}</span>
        <span className="text-lg">/mo/user</span>
      </p>
      <p className="mt-3 text-sm text-muted-foreground">billed {billedLabel}</p>

      <Button
        asChild
        type="button"
        variant={isFeatured ? "default" : "outline"}
        disabled={isLoading}
        onClick={onSelect}
        className={cn(
          "relative mt-6 h-14 w-full min-w-0 overflow-hidden rounded-full border border-black/50 px-5.5! py-3 text-sm font-medium",
          isFeatured ? "border-black bg-black text-white" : "bg-transparent"
        )}
      >
        <motion.button
          type="button"
          className="min-w-0"
          initial="rest"
          animate="rest"
          whileHover="hover"
          transition={slideTransition}
        >
          <span className="sr-only">{ctaText}</span>
          <span aria-hidden className="relative mx-auto block h-5 min-h-6 w-full min-w-0 overflow-hidden">
            <motion.span
              className="flex w-full flex-col"
              variants={{
                rest: { y: 0 },
                hover: { y: "-1.25rem" },
              }}
              transition={slideTransition}
            >
              <span className={ctaLineClass}>{ctaText}</span>
              <span className={ctaLineClass}>{ctaText}</span>
            </motion.span>
          </span>
        </motion.button>
      </Button>

      <p className="mt-8 text-sm font-semibold">What do you get:</p>
      <ul className="mt-5 space-y-3">
        {features.map((feature, index) => {
          const isMuted = isLastFeatureMuted && index === features.length - 1
          return (
            <li key={feature} className="flex items-center gap-3 text-sm">
              <span className={cn("size-3 rounded-full bg-primary", isMuted && "bg-[#d8d8de]")} />
              <span className={cn("", isMuted && "text-[#cbccd3]")}>{feature}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
