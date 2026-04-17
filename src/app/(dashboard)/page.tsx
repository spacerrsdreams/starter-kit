import { redirect } from "next/navigation"

import { WebRoutes } from "@/lib/web.routes"

export default function DashboardPage() {
  redirect(WebRoutes.askAi.path)
}
