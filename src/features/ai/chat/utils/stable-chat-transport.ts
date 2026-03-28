import { DefaultChatTransport } from "ai"

import { ApiRoutes } from "@/lib/api.routes"

export function createStableChatTransport() {
  let chatId: string | null = null

  const transport = new DefaultChatTransport({
    api: ApiRoutes.chat,
    body: () => {
      if (!chatId) {
        throw new Error("Missing chat id")
      }
      return { chatId }
    },
    credentials: "same-origin",
  })

  return {
    transport,
    getChatId() {
      return chatId
    },
    setChatId(next: string | null) {
      chatId = next
    },
  }
}
