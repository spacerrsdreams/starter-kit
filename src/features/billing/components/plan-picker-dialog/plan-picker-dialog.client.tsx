"use client"

import { useTranslations } from "next-intl"

import { PlanPicker } from "@/features/billing/components/plan-picker-dialog/plan-picker.client"
import type { PlanPickerDialogProps } from "@/features/billing/types/plan-picker-dialog.types"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export function PlanPickerDialog({ open, onOpenChange, isBillingLoading, onProductSelect }: PlanPickerDialogProps) {
  const t = useTranslations("home.pricing")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-dvh max-h-dvh w-screen max-w-[100vw] gap-0 overflow-y-auto rounded-none border-none bg-background p-0 sm:max-w-[100vw]">
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        <PlanPicker isBillingLoading={isBillingLoading} onProductSelect={onProductSelect} />
      </DialogContent>
    </Dialog>
  )
}
