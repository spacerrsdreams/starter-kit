import { WebRoutes } from "@/lib/web.routes"

export function getChatRoute(chatId: string) {
  return `${WebRoutes.askAi.path}/${chatId}`
}
