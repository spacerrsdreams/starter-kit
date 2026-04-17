import { createContext, useContext } from "react"

type PlanPickerDialogContextValue = {
  openPlanPickerDialog: () => void
  closePlanPickerDialog: () => void
  isPlanPickerCheckoutLoading: boolean
}

export const PlanPickerDialogContext = createContext<PlanPickerDialogContextValue | null>(null)

export function usePlanPickerDialog(): PlanPickerDialogContextValue | null {
  return useContext(PlanPickerDialogContext)
}
