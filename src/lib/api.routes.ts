export const ApiRoutes = {
  chat: "/api/chat",
  chats: {
    list: "/api/chats",
    create: "/api/chats",
    get: (chatId: string) => `/api/chats/${chatId}`,
    delete: (chatId: string) => `/api/chats/${chatId}`,
  },
  authSignedIn: "/api/auth/signed-in",
  accountSendVerificationEmail: "/api/account/send-verification-email",
} as const
