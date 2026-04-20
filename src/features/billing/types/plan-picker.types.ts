export type PlanPickerProps = {
  isBillingLoading: boolean
  onSelectInterval: (interval: "monthly" | "yearly") => void
}
