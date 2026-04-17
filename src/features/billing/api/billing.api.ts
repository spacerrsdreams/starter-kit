import { ApiRoutes } from "@/lib/api.routes"
import { apiRequest } from "@/lib/http-client"
import type {
  BillingSubscriptionResponse,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  CreatePortalSessionResponse,
} from "@/features/billing/types/billing-api.types"

export async function getBillingSubscriptionApi() {
  const response = await apiRequest<BillingSubscriptionResponse>(ApiRoutes.billing.subscription)
  return response.subscription
}

export async function createCheckoutSessionApi(payload: CreateCheckoutSessionRequest) {
  return apiRequest<CreateCheckoutSessionResponse>(ApiRoutes.billing.checkoutSession, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function createPortalSessionApi() {
  return apiRequest<CreatePortalSessionResponse>(ApiRoutes.billing.portalSession, {
    method: "POST",
  })
}
