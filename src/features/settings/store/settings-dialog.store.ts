import { create } from "zustand"

import type { SettingsSectionId } from "@/features/settings/types/settings-dialog.types"

type SettingsDialogStore = {
  open: boolean
  section: SettingsSectionId
  openDialog: (section?: SettingsSectionId) => void
  closeDialog: () => void
}

export const useSettingsDialogStore = create<SettingsDialogStore>((set) => ({
  open: false,
  section: "account",
  openDialog: (section) =>
    set({
      open: true,
      section: section ?? "account",
    }),
  closeDialog: () =>
    set({
      open: false,
    }),
}))
