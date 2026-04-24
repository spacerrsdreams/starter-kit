"use client"

import { useRouter } from "next/navigation"

import { WebRoutes } from "@/lib/web.routes"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { authClient } from "@/features/auth/lib/auth-client"
import { WaveGlowButton } from "@/components/ui/wave-glow-button"

type GetStartedCtaButtonProps = {
  label: string
}

export function GetStartedCtaButton({ label }: GetStartedCtaButtonProps) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const { openAuthModal } = useAuthRequiredModal()

  return (
    <WaveGlowButton
      label={label}
      disabled={isPending}
      onClick={() => {
        if (session?.user) {
          router.push(WebRoutes.dashboard.path)
        } else {
          openAuthModal()
        }
      }}
    />
  )
}
