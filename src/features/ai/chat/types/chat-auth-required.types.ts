export type ChatAuthRequiredStore = {
  pendingPrompt: string | null
  setPendingPrompt: (prompt: string) => void
  clearPendingPrompt: () => void
}
