export type PlanPickerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isBillingLoading: boolean
  onProductSelect: (selectedProduct: "monthly" | "yearly") => void
}
