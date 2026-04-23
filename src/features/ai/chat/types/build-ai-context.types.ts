export type BuildAiContextInput = {
  includeSystemInstructions?: boolean
  includeCompanyInstructions?: boolean
  includePolicyContext?: boolean
  includeAvailablePages?: boolean
  userRole?: "user" | "admin" | "moderator"
  currentPath?: string
  featureFlags?: string[]
  extraInstructions?: string[]
}
