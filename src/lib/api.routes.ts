export const ApiRoutes = {
  chat: "/api/chat",
  chats: {
    list: "/api/chats",
    create: "/api/chats",
    get: (chatId: string) => `/api/chats/${chatId}`,
    delete: (chatId: string) => `/api/chats/${chatId}`,
    setMessageReaction: (chatId: string, messageId: string) => `/api/chats/${chatId}/messages/${messageId}/reaction`,
  },
  authSignedIn: "/api/auth/signed-in",
  account: {
    activity: "/api/account/activity",
  },
  accountSendVerificationEmail: "/api/account/send-verification-email",
  billing: {
    subscription: "/api/billing/subscription",
    products: "/api/billing/products",
    checkoutSession: "/api/billing/checkout-session",
    portalSession: "/api/billing/portal-session",
    webhook: "/api/billing/webhook",
  },
  admin: {
    users: {
      list: "/api/admin/users",
      update: (userId: string) => `/api/admin/users/${userId}`,
      delete: (userId: string) => `/api/admin/users/${userId}`,
    },
  },
  blog: {
    list: "/api/blog",
    create: "/api/blog",
    byId: (postId: string) => `/api/blog/${postId}`,
    uploadCover: "/api/blog/upload-cover",
  },
} as const
