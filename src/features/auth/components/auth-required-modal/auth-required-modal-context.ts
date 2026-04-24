"use client"

import { createContext, useContext, type ReactNode } from "react"

export type AuthRequiredModalContextValue = {
  openAuthModal: (options?: { redirectPath?: string }) => void
}

export type AuthRequiredModalProviderProps = {
  children: ReactNode
}

export const AuthRequiredModalContext = createContext<AuthRequiredModalContextValue | null>(null)

export function useAuthRequiredModal() {
  const context = useContext(AuthRequiredModalContext)

  return (
    context ?? {
      openAuthModal: () => {},
    }
  )
}
