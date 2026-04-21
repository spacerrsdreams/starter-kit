"use client"

import { PlanPicker } from "@/features/billing/components/plan-picker-dialog/plan-picker.client"

export function PricingContentPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-30 sm:px-6 md:py-45">
      <PlanPicker isBillingLoading={false} showMainlabel={false} onSelectInterval={() => {}} />
    </main>
  )
}
