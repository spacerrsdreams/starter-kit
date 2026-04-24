import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const userActivityPersistedStateSchema = z.object({
  lastTrackedDateByUserId: z.record(z.string(), z.string()),
})

type UserActivityStore = {
  lastTrackedDateByUserId: Record<string, string>
  markTracked: (userId: string, dateKey: string) => void
}

export const useUserActivityStore = create<UserActivityStore>()(
  persist(
    (set) => ({
      lastTrackedDateByUserId: {},
      markTracked: (userId, dateKey) =>
        set((state) => ({
          lastTrackedDateByUserId: {
            ...state.lastTrackedDateByUserId,
            [userId]: dateKey,
          },
        })),
    }),
    {
      name: "user-activity-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lastTrackedDateByUserId: state.lastTrackedDateByUserId }),
      merge: (persistedState, currentState) => {
        const parsed = userActivityPersistedStateSchema.safeParse(persistedState)

        if (!parsed.success) {
          return currentState
        }

        return {
          ...currentState,
          ...parsed.data,
        }
      },
    }
  )
)
