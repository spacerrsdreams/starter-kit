import { create } from "zustand"

import type { ChatNavigationStore } from "@/features/ai/chat/types/chat.types"

export const useChatNavigationStore = create<ChatNavigationStore>((set) => ({
  activeChatId: null,
  setActiveChatId: (chatId) =>
    set({
      activeChatId: chatId,
    }),
}))
