"use client"

import { useCallback, useState } from "react"

type SignInUiState = {
  googleLoading: boolean
  passkeyLoading: boolean
  showPassword: boolean
  errorCode: string | null
  reactivateOpen: boolean
  reactivateError: string | null
  isTwoFactorRequired: boolean
  twoFactorCode: string
  isUsingBackupCode: boolean
  twoFactorError: string | null
  isVerifyingTwoFactor: boolean
  canUsePasskeyOnDevice: boolean
}

const initialSignInUiState: SignInUiState = {
  googleLoading: false,
  passkeyLoading: false,
  showPassword: false,
  errorCode: null,
  reactivateOpen: false,
  reactivateError: null,
  isTwoFactorRequired: false,
  twoFactorCode: "",
  isUsingBackupCode: false,
  twoFactorError: null,
  isVerifyingTwoFactor: false,
  canUsePasskeyOnDevice: false,
}

export function useSignInUiState() {
  const [ui, setUi] = useState<SignInUiState>(initialSignInUiState)

  const patchUi = useCallback((patch: Partial<SignInUiState>) => {
    setUi((previous) => ({ ...previous, ...patch }))
  }, [])

  return {
    ui,
    setUi,
    patchUi,
  }
}
