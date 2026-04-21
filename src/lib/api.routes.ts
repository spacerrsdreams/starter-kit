export const ApiRoutes = {
  chat: "/api/chat",
  chats: {
    list: "/api/chats",
    create: "/api/chats",
    get: (chatId: string) => `/api/chats/${chatId}`,
    delete: (chatId: string) => `/api/chats/${chatId}`,
    setMessageReaction: (chatId: string, messageId: string) => `/api/chats/${chatId}/messages/${messageId}/reaction`,
    share: (chatId: string) => `/api/chats/${chatId}/share`,
  },
  sharedChats: {
    get: (shareId: string) => `/api/shared-chats/${shareId}`,
  },
  authSignedIn: "/api/auth/signed-in",
  accountSendVerificationEmail: "/api/account/send-verification-email",
  billing: {
    subscription: "/api/billing/subscription",
    checkoutSession: "/api/billing/checkout-session",
    portalSession: "/api/billing/portal-session",
    webhook: "/api/billing/webhook",
  },
} as const
