"use client"

import dynamic from "next/dynamic"

import { authClient } from "@/lib/auth/auth-client"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { Button } from "@/components/ui/button"

import { SidebarFooterSkeleton } from "./sidebar-footer-skeleton"

const UserButton = dynamic(() => import("@/features/auth/components/user-button").then((module) => module.UserButton), {
  ssr: false,
  loading: () => <SidebarFooterSkeleton />,
})

type SessionData = ReturnType<typeof authClient.useSession>["data"]

type SidebarFooterUserActionProps = {
  isSessionPending: boolean
  session: SessionData
}

export function SidebarFooterUserAction({ isSessionPending, session }: SidebarFooterUserActionProps) {
  const authModalContext = useAuthRequiredModal()

  if (isSessionPending) {
    return <SidebarFooterSkeleton />
  }

  if (!session?.user) {
    return (
      <div className="px-2">
        <Button type="button" variant="outline" className="w-full" onClick={() => authModalContext?.openAuthModal()}>
          Sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end">
      <UserButton
        user={session.user}
        isAdmin={session.user.role === "admin"}
        isImpersonating={Boolean(session.session.impersonatedBy)}
      />
    </div>
  )
}
