"use client"

import { Database } from "lucide-react"
import { useTranslations } from "next-intl"

import { SectionHeading } from "@/components/section-heading"
import { PricingPlanCard } from "@/features/billing/components/plan-picker-dialog/pricing-plan-card.client"
import { useFetchBillingProducts } from "@/features/billing/hooks/use-fetch-billing-products"
import { useFetchBillingSubscription } from "@/features/billing/hooks/use-fetch-billing-subscription"

export type PlanPickerProps = {
  isBillingLoading: boolean
  showMainlabel?: boolean
  onProductSelect: (selectedProduct: "monthly" | "yearly") => void
}

export function PlanPicker({ isBillingLoading, showMainlabel = true, onProductSelect }: PlanPickerProps) {
  const t = useTranslations("home.pricing")
  const { data: billingProducts } = useFetchBillingProducts()
  const { data: billingSubscription } = useFetchBillingSubscription()
  const monthlyUnitAmount = billingProducts?.monthly.unitAmount
  const yearlyUnitAmount = billingProducts?.yearly.unitAmount
  const hasStripePrices = monthlyUnitAmount !== undefined && yearlyUnitAmount !== undefined
  const monthlyPrice = hasStripePrices ? monthlyUnitAmount / 100 : 0
  const yearlyPrice = hasStripePrices ? Math.round((yearlyUnitAmount / 100 / 12) * 100) / 100 : 0
  const isSubscribedToPaidPlan = Boolean(billingSubscription?.isPaid)
  const monthlyPlanFeatures = [t("features.essentialTools"), t("features.upToFiveProjects"), t("features.emailSupport")]
  const yearlyPlanFeatures = [t("features.essentialTools"), t("features.unlimitedProjects"), t("features.emailSupport")]

  const monthlyBadgeLabel =
    isSubscribedToPaidPlan && billingSubscription?.currentProduct === "monthly" ? t("currentBadge") : undefined
  const yearlyBadgeLabel =
    isSubscribedToPaidPlan && billingSubscription?.currentProduct === "yearly" ? t("currentBadge") : undefined

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="items-center px-5 py-6 text-center sm:px-8 sm:py-7">
        {showMainlabel === true ? (
          <SectionHeading
            chipIcon={Database}
            chipText={t("chip")}
            title={t("title")}
            titleClassName="mb-8 text-2xl leading-3 font-semibold text-balance sm:text-5xl"
          />
        ) : (
          <h2 className="mt-6 mb-8 text-2xl leading-3 font-semibold tracking-[-2.5px] text-balance sm:text-5xl">
            {t("title")}
          </h2>
        )}
      </div>

      <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 md:flex-row">
        <PricingPlanCard
          title={t("monthlyTitle")}
          subtitle={t("subtitle")}
          price={monthlyPrice}
          billedLabel={t("billedMonthly")}
          features={monthlyPlanFeatures}
          ctaLabel={t("cta")}
          isLoading={isBillingLoading || !hasStripePrices}
          onSelect={() => onProductSelect("monthly")}
          isLastFeatureMuted
          badgeLabel={monthlyBadgeLabel}
        />
        <PricingPlanCard
          title={t("yearlyTitle")}
          subtitle={t("subtitle")}
          price={yearlyPrice}
          billedLabel={t("billedYearly")}
          features={yearlyPlanFeatures}
          ctaLabel={t("cta")}
          isLoading={isBillingLoading || !hasStripePrices}
          onSelect={() => onProductSelect("yearly")}
          isFeatured
          badgeLabel={yearlyBadgeLabel}
        />
      </div>
    </div>
  )
}
