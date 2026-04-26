import { create } from "zustand"

import type { SettingsSectionId } from "@/features/settings/types/settings.types"

type SettingsDialogStore = {
  open: boolean
  section: SettingsSectionId
  openDialog: (section?: SettingsSectionId) => void
  closeDialog: () => void
}

export const useSettingsDialogStore = create<SettingsDialogStore>((set) => ({
  open: false,
  section: "profile",
  openDialog: (section) =>
    set({
      open: true,
      section: section ?? "profile",
    }),
  closeDialog: () =>
    set({
      open: false,
    }),
}))
