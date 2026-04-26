import "server-only"

import {
  AVAILABLE_APP_PAGES_CONTEXT,
  COMPANY_LEVEL_INSTRUCTIONS,
  PRIVACY_POLICY_CONTEXT,
  SYSTEM_LEVEL_INSTRUCTIONS,
  TERMS_OF_SERVICE_CONTEXT,
} from "@/features/ai/chat/constants/ai-shared-context.constants"
import type { BuildAiContextInput } from "@/features/ai/chat/types/chat.server.types"

function formatSection(title: string, lines: string[]) {
  return [`## ${title}`, ...lines].join("\n")
}

export function buildAiContext(input: BuildAiContextInput = {}) {
  const sections: string[] = []
  const includeSystemInstructions = input.includeSystemInstructions ?? true
  const includeCompanyInstructions = input.includeCompanyInstructions ?? true
  const includePolicyContext = input.includePolicyContext ?? true
  const includeAvailablePages = input.includeAvailablePages ?? true

  if (includeSystemInstructions) {
    sections.push(formatSection("System Instructions", [...SYSTEM_LEVEL_INSTRUCTIONS]))
  }

  if (includeCompanyInstructions) {
    sections.push(formatSection("Company Context", [...COMPANY_LEVEL_INSTRUCTIONS]))
  }

  if (includePolicyContext) {
    sections.push(formatSection("Terms of Service", [...TERMS_OF_SERVICE_CONTEXT]))
    sections.push(formatSection("Privacy Policy", [...PRIVACY_POLICY_CONTEXT]))
  }

  if (includeAvailablePages) {
    sections.push(formatSection("Available Pages", [...AVAILABLE_APP_PAGES_CONTEXT]))
  }

  if (input.userRole) {
    sections.push(formatSection("User Context", [`Role: ${input.userRole}`]))
  }

  if (input.currentPath) {
    sections.push(formatSection("Request Context", [`Path: ${input.currentPath}`]))
  }

  if (input.featureFlags && input.featureFlags.length > 0) {
    sections.push(formatSection("Feature Flags", input.featureFlags.map((flag) => `- ${flag}`)))
  }

  if (input.extraInstructions && input.extraInstructions.length > 0) {
    sections.push(formatSection("Additional Instructions", input.extraInstructions.map((line) => `- ${line}`)))
  }

  return sections.join("\n\n").trim()
}
