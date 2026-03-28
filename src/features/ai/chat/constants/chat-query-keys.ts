export const chatQueryKeys = {
  chats: () => ["chat", "list"] as const,
  chat: (id: string) => ["chat", "detail", id] as const,
}
