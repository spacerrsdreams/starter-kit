export type ChatNavigationStore = {
  activeChatId: string | null
  setActiveChatId: (chatId: string | null) => void
}
