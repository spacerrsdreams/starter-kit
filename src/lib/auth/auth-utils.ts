import "server-only"

import { isAPIError } from "better-auth/api"

import { UNKNOWN_ERROR_CODE } from "@/features/auth/constants"

export function getAuthApiErrorCode(error: unknown): string {
  if (isAPIError(error)) {
    return error.body?.code ?? UNKNOWN_ERROR_CODE
  }

  return UNKNOWN_ERROR_CODE
}
