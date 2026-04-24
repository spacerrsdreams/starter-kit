"use client"

import { Database } from "lucide-react"

import { PricingPlanCard } from "@/features/billing/components/plan-picker-dialog/pricing-plan-card.client"
import { useFetchBillingProducts } from "@/features/billing/hooks/use-fetch-billing-products"
import { useFetchBillingSubscription } from "@/features/billing/hooks/use-fetch-billing-subscription"
import { Chip } from "@/components/ui/chip"

const MONTHLY_PLAN_FEATURES = ["Essential tools to get you up", "Up to 5 projects & reporting", "Email support"]
const YEARLY_PLAN_FEATURES = ["Essential tools to get you up", "Unlimited projects & reporting", "Email support"]

export type PlanPickerProps = {
  isBillingLoading: boolean
  showMainlabel?: boolean
  onProductSelect: (selectedProduct: "monthly" | "yearly") => void
}

export function PlanPicker({ isBillingLoading, showMainlabel = true, onProductSelect }: PlanPickerProps) {
  const { data: billingProducts } = useFetchBillingProducts()
  const { data: billingSubscription } = useFetchBillingSubscription()
  const monthlyUnitAmount = billingProducts?.monthly.unitAmount
  const yearlyUnitAmount = billingProducts?.yearly.unitAmount
  const hasStripePrices = monthlyUnitAmount !== undefined && yearlyUnitAmount !== undefined
  const monthlyPrice = hasStripePrices ? monthlyUnitAmount / 100 : 0
  const yearlyPrice = hasStripePrices ? Math.round((yearlyUnitAmount / 100 / 12) * 100) / 100 : 0
  const isSubscribedToPaidPlan = Boolean(billingSubscription?.isPaid)
  const monthlyBadgeLabel =
    isSubscribedToPaidPlan && billingSubscription?.currentProduct === "monthly" ? "CURRENT" : undefined
  const yearlyBadgeLabel =
    isSubscribedToPaidPlan && billingSubscription?.currentProduct === "yearly" ? "CURRENT" : undefined

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="items-center px-5 py-6 text-center sm:px-8 sm:py-7">
        {showMainlabel === true && <Chip title="Pricing" Icon={Database} />}
        <h2 className="mt-6 text-2xl leading-3 font-semibold tracking-[-2.5px] text-balance sm:text-5xl">
          Choose the Perfect Plan
        </h2>
      </div>

      <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 md:flex-row">
        <PricingPlanCard
          title="Monthly"
          subtitle="Perfect for individuals and small teams just getting started"
          price={monthlyPrice}
          billedLabel="monthly"
          features={MONTHLY_PLAN_FEATURES}
          ctaLabel="Get Started"
          isLoading={isBillingLoading || !hasStripePrices}
          onSelect={() => onProductSelect("monthly")}
          isLastFeatureMuted
          badgeLabel={monthlyBadgeLabel}
        />
        <PricingPlanCard
          title="Yearly"
          subtitle="Perfect for individuals and small teams just getting started"
          price={yearlyPrice}
          billedLabel="yearly"
          features={YEARLY_PLAN_FEATURES}
          ctaLabel="Get Started"
          isLoading={isBillingLoading || !hasStripePrices}
          onSelect={() => onProductSelect("yearly")}
          isFeatured
          badgeLabel={yearlyBadgeLabel}
        />
      </div>
    </div>
  )
}
