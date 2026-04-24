"use client"

import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth/auth-client"
import { WebRoutes } from "@/lib/web.routes"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
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
