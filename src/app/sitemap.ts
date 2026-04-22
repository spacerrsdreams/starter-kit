import { MetadataRoute } from "next"

import { WebRoutes } from "@/lib/web.routes"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: WebRoutes.root.withBaseUrl() },
    { url: WebRoutes.search.withBaseUrl() },
    { url: WebRoutes.dashboard.withBaseUrl() },
    { url: WebRoutes.pricing.withBaseUrl() },
    { url: WebRoutes.signIn.withBaseUrl() },
    { url: WebRoutes.signUp.withBaseUrl() },
    { url: WebRoutes.contact.withBaseUrl() },
    { url: WebRoutes.feedback.withBaseUrl() },
    { url: WebRoutes.privacyPolicy.withBaseUrl() },
    { url: WebRoutes.termsOfService.withBaseUrl() },
  ]
}
