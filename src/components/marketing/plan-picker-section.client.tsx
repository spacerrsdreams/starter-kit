"use client"

import { PlanPicker } from "@/features/billing/components/plan-picker-dialog/plan-picker.client"

export function PlanPickerSectionClient() {
  return (
    <section className="w-full px-4 py-0">
      <PlanPicker isBillingLoading={false} onSelectInterval={() => {}} />
    </section>
  )
}
