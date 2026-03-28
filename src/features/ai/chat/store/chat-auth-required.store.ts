import { create } from "zustand"

import type { ChatAuthRequiredStore } from "@/features/ai/chat/types/chat-auth-required.types"

export const useChatAuthRequiredStore = create<ChatAuthRequiredStore>((set) => ({
  pendingPrompt: null,
  setPendingPrompt: (prompt) =>
    set({
      pendingPrompt: prompt,
    }),
  clearPendingPrompt: () =>
    set({
      pendingPrompt: null,
    }),
}))
