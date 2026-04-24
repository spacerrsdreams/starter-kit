export const deactivationFeedbackCategories = [
  "MISSING_FEATURES",
  "TOO_EXPENSIVE",
  "TOO_COMPLEX",
  "BUGS_OR_PERFORMANCE",
  "PRIVACY_CONCERNS",
  "SWITCHED_TO_ALTERNATIVE",
  "OTHER",
] as const

export const deactivationFeedbackCategoryLabels: Record<(typeof deactivationFeedbackCategories)[number], string> = {
  MISSING_FEATURES: "Missing features",
  TOO_EXPENSIVE: "Too expensive",
  TOO_COMPLEX: "Too complex to use",
  BUGS_OR_PERFORMANCE: "Bugs or performance issues",
  PRIVACY_CONCERNS: "Privacy concerns",
  SWITCHED_TO_ALTERNATIVE: "Switched to an alternative",
  OTHER: "Other",
}
