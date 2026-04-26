import { create } from "zustand"
import { persist } from "zustand/middleware"

type PasskeyStatusStore = {
  hasPasskeyHint: boolean
  setHasPasskeyHint: (value: boolean) => void
}

export const usePasskeyStatusStore = create<PasskeyStatusStore>()(
  persist(
    (set) => ({
      hasPasskeyHint: false,
      setHasPasskeyHint: (value) => set({ hasPasskeyHint: value }),
    }),
    {
      name: "settings-passkey-status",
    }
  )
)
