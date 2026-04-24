export type PlanPickerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isBillingLoading: boolean
  onProductSelect: (selectedPlan: "monthly" | "yearly") => void
}
