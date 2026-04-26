import { create } from "zustand"

import type { ChatAuthRequiredStore } from "@/features/ai/chat/types/chat.types"

const PENDING_PROMPT_STORAGE_KEY = "ai:pending-auth-prompt"

const readPendingPromptFromStorage = (): string | null => {
  if (typeof window === "undefined") {
    return null
  }
  const storedPrompt = window.localStorage.getItem(PENDING_PROMPT_STORAGE_KEY)
  if (!storedPrompt) {
    return null
  }
  const normalizedPrompt = storedPrompt.trim()
  return normalizedPrompt.length > 0 ? normalizedPrompt : null
}

const writePendingPromptToStorage = (prompt: string | null) => {
  if (typeof window === "undefined") {
    return
  }
  if (!prompt) {
    window.localStorage.removeItem(PENDING_PROMPT_STORAGE_KEY)
    return
  }
  window.localStorage.setItem(PENDING_PROMPT_STORAGE_KEY, prompt)
}

export const useChatAuthRequiredStore = create<ChatAuthRequiredStore>((set) => ({
  pendingPrompt: readPendingPromptFromStorage(),
  setPendingPrompt: (prompt) => {
    const normalizedPrompt = prompt.trim()
    if (!normalizedPrompt) {
      writePendingPromptToStorage(null)
      set({
        pendingPrompt: null,
      })
      return
    }
    writePendingPromptToStorage(normalizedPrompt)
    set({
      pendingPrompt: normalizedPrompt,
    })
  },
  clearPendingPrompt: () => {
    writePendingPromptToStorage(null)
    set({
      pendingPrompt: null,
    })
  },
}))
