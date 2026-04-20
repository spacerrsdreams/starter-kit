"use client"

import { Database } from "lucide-react"
import { useState } from "react"

import { PricingPlanCard } from "@/features/billing/components/plan-picker-dialog/pricing-plan-card.client"
import type { PlanPickerProps } from "@/features/billing/types/plan-picker.types"
import { Chip } from "@/components/ui/chip"
import { Switch } from "@/components/ui/switch"

const MONTHLY_PLAN_FEATURES = ["Essential tools to get you up", "Up to 5 projects & reporting", "Email support"]

const YEARLY_PLAN_FEATURES = ["Essential tools to get you up", "Unlimited projects & reporting", "Email support"]

export function PlanPicker({ isBillingLoading, onSelectInterval }: PlanPickerProps) {
  const [isYearly, setIsYearly] = useState(false)
  const starterPrice = isYearly ? 31 : 39
  const ultimatePrice = isYearly ? 63 : 79
  const billedLabel = isYearly ? "yearly" : "monthly"
  const selectedInterval = isYearly ? "yearly" : "monthly"

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="items-center px-5 py-6 text-center sm:px-8 sm:py-7">
        <Chip title="Pricing" Icon={Database} />
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">Choose the Perfect Plan</h2>
        <div className="mt-16 flex w-full items-center justify-center gap-3">
          <span className="text-sm font-medium">Monthly</span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            disabled={isBillingLoading}
            aria-label="Billing cycle"
            className="border-border px-2 py-1 data-[size=default]:h-7 data-[size=default]:w-14 data-checked:bg-accent-1 data-checked:**:data-[slot=switch-thumb]:translate-x-6 data-checked:**:data-[slot=switch-thumb]:bg-white data-unchecked:bg-sidebar data-unchecked:**:data-[slot=switch-thumb]:translate-x-0 data-unchecked:**:data-[slot=switch-thumb]:bg-black"
          />
          <span className="text-sm font-semibold">Yearly</span>
          <span className="rounded-full bg-accent-1 px-2.5 py-1 text-xs font-medium text-white">SAVE 20%</span>
        </div>
      </div>

      <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 md:flex-row">
        <PricingPlanCard
          title="Starter"
          subtitle="Perfect for individuals and small teams just getting started"
          price={starterPrice}
          billedLabel={billedLabel}
          features={MONTHLY_PLAN_FEATURES}
          ctaLabel="Get 14 Days Free Trial"
          isLoading={isBillingLoading}
          onSelect={() => onSelectInterval(selectedInterval)}
          isLastFeatureMuted
        />
        <PricingPlanCard
          title="Ultimate"
          subtitle="Perfect for individuals and small teams just getting started"
          price={ultimatePrice}
          billedLabel={billedLabel}
          features={YEARLY_PLAN_FEATURES}
          ctaLabel="Get 14 Days Free Trial"
          isLoading={isBillingLoading}
          onSelect={() => onSelectInterval(selectedInterval)}
          isFeatured
        />
      </div>
    </div>
  )
}
