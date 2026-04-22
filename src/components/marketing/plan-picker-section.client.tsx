"use client"

import { PlanPicker } from "@/features/billing/components/plan-picker-dialog/plan-picker.client"

export function PlanPickerSectionClient() {
  return (
    <section className="w-full px-8 py-14 md:py-20">
      <PlanPicker isBillingLoading={false} showMainlabel={false} onSelectInterval={() => {}} />
    </section>
  )
}
