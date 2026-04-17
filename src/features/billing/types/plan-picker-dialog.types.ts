export type PlanPickerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isBillingLoading: boolean
  onSelectInterval: (interval: "monthly" | "yearly") => void
}
