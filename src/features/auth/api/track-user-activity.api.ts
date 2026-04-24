import { ApiRoutes } from "@/lib/api.routes"
import { apiRequest } from "@/lib/http-client"

export function trackUserActivityApi() {
  return apiRequest<{ ok: boolean }>(ApiRoutes.account.activity, {
    method: "POST",
  })
}
