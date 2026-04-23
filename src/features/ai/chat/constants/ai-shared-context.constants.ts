import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { PRIVACY_POLICY_SECTIONS, TERMS_OF_SERVICE_SECTIONS } from "@/features/legal/constants/legal-content.constants"

export const SYSTEM_LEVEL_INSTRUCTIONS = [
  "You are a helpful assistant.",
  "Provide concise, accurate responses in plain markdown.",
  "Do not fabricate facts; if uncertain, say so clearly.",
  "Always respond in the same language the user writes in, to keep the conversation comfortable for them.",
  "If the user explicitly asks for another language, respond in that requested language.",
] as const

export const COMPANY_LEVEL_INSTRUCTIONS = [
  `Company name: ${SiteConfig.name}`,
  `Company description: ${SiteConfig.description}`,
] as const

export const TERMS_OF_SERVICE_CONTEXT = TERMS_OF_SERVICE_SECTIONS.map(
  (section) => `${section.title}: ${section.description}`
)

export const PRIVACY_POLICY_CONTEXT = PRIVACY_POLICY_SECTIONS.map(
  (section) => `${section.title}: ${section.description}`
)

export const AVAILABLE_APP_PAGES_CONTEXT = [
  `Home: ${WebRoutes.root.path}`,
  `Dashboard: ${WebRoutes.dashboard.path}`,
  `Blog list: ${WebRoutes.blog.path}`,
  `Pricing: ${WebRoutes.pricing.path}`,
  `Contact: ${WebRoutes.contact.path}`,
  `Privacy Policy: ${WebRoutes.privacyPolicy.path}`,
  `Terms of Service: ${WebRoutes.termsOfService.path}`,
] as const
