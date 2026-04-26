import "server-only"

import {
  INPUT_TOKENS_SAFETY_MARGIN,
  MAX_OUTPUT_TOKENS,
  MODEL_INPUT_COST_PER_MILLION,
  MODEL_OUTPUT_COST_PER_MILLION,
  PER_TURN_COST_CAP_USD,
} from "@/features/ai/chat/constants/chat-model.constants"

export function getMaxInputTokensFromCostBudget(): number {
  const reservedOutputCost = (MAX_OUTPUT_TOKENS * MODEL_OUTPUT_COST_PER_MILLION) / 1_000_000
  const remainingBudget = Math.max(0, PER_TURN_COST_CAP_USD - reservedOutputCost)
  const rawMaxInputTokens = Math.floor((remainingBudget * 1_000_000) / MODEL_INPUT_COST_PER_MILLION)

  return Math.max(500, Math.floor(rawMaxInputTokens * INPUT_TOKENS_SAFETY_MARGIN))
}
