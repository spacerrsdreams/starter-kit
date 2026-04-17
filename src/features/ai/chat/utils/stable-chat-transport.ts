import { DefaultChatTransport } from "ai"

import { ApiRoutes } from "@/lib/api.routes"

export function createStableChatTransport() {
  let chatId: string | null = null

  const transport = new DefaultChatTransport({
    api: ApiRoutes.chat,
    prepareSendMessagesRequest: ({ body, messageId, messages, trigger }) => {
      if (!chatId) {
        throw new Error("Missing chat id")
      }
      if (trigger === "submit-message") {
        const latestMessage = messages[messages.length - 1]
        if (!latestMessage) {
          throw new Error("Missing message to send")
        }
        return {
          body: {
            chatId,
            message: latestMessage,
          },
        }
      }

      return {
        body: {
          chatId,
          trigger,
          messageId,
          ...(body && typeof body === "object" ? body : {}),
        },
      }
    },
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
