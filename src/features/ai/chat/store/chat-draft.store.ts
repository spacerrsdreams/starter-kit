import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { ChatDraftStore } from "@/features/ai/chat/types/chat.types"

const chatDraftPersistedStateSchema = z.object({
  draft: z.string(),
})

export const useChatDraftStore = create<ChatDraftStore>()(
  persist(
    (set) => ({
      draft: "",
      setDraft: (draft) =>
        set({
          draft,
        }),
      clearDraft: () =>
        set({
          draft: "",
        }),
    }),
    {
      name: "chat-draft-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft }),
      merge: (persistedState, currentState) => {
        const parsed = chatDraftPersistedStateSchema.safeParse(persistedState)

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
