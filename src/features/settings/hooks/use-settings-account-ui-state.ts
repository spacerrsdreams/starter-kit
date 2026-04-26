"use client"

import { useCallback, useState } from "react"

type SettingsAccountUiState = {
  isDeactivateDialogOpen: boolean
  isSendingVerification: boolean
  hasSentVerification: boolean
  resendCooldown: number
  verificationError: string | null
  isAddingPasskey: boolean
  passkeyMessage: string | null
  hasPasskey: boolean
  hasPassword: boolean | null
  isSendingPasswordReset: boolean
  passwordResetCooldown: number
  passwordMessage: string | null
  twoFactorPassword: string
  showTwoFactorPasswordStep: boolean
  isEnablingTwoFactor: boolean
  twoFactorTotpUri: string | null
  twoFactorBackupCodes: string[]
  twoFactorVerificationCode: string
  isVerifyingTwoFactor: boolean
  isDisablingTwoFactor: boolean
  twoFactorMessage: string | null
}

const initialSettingsAccountUiState: SettingsAccountUiState = {
  isDeactivateDialogOpen: false,
  isSendingVerification: false,
  hasSentVerification: false,
  resendCooldown: 0,
  verificationError: null,
  isAddingPasskey: false,
  passkeyMessage: null,
  hasPasskey: false,
  hasPassword: null,
  isSendingPasswordReset: false,
  passwordResetCooldown: 0,
  passwordMessage: null,
  twoFactorPassword: "",
  showTwoFactorPasswordStep: false,
  isEnablingTwoFactor: false,
  twoFactorTotpUri: null,
  twoFactorBackupCodes: [],
  twoFactorVerificationCode: "",
  isVerifyingTwoFactor: false,
  isDisablingTwoFactor: false,
  twoFactorMessage: null,
}

export function useSettingsAccountUiState() {
  const [ui, setUi] = useState<SettingsAccountUiState>(initialSettingsAccountUiState)

  const patchUi = useCallback((patch: Partial<SettingsAccountUiState>) => {
    setUi((previous) => ({ ...previous, ...patch }))
  }, [])

  return {
    ui,
    patchUi,
  }
}
