"use client"

import { AlertCircle, LogOut, Settings, User, UserRoundCheck } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { cn } from "@/lib/utils"
import { WebRoutes } from "@/lib/web.routes"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { authClient } from "@/features/auth/lib/auth-client"
import { SettingsDialog } from "@/features/settings/components/settings-dialog/settings-dialog"
import { Button } from "@/components/ui/button"
import { LogoSvg } from "@/components/ui/icons/logo.icon"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const authModalContext = useAuthRequiredModal()
  const [isPending, startTransition] = useTransition()
  const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const user = session?.user

  const askAiPath = WebRoutes.dashboard.path
  const isAskAiActive = pathname === askAiPath || pathname.startsWith(`${askAiPath}/`)

  const navIconClassName = "size-5 shrink-0"

  const handleSignInClick = () => {
    authModalContext?.openAuthModal()
  }

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut()
    })
  }

  const handleStopImpersonation = () => {
    startTransition(async () => {
      await authClient.admin.stopImpersonating()
      router.push(WebRoutes.dashboard.path)
    })
  }

  const userInitials = (user?.name ?? "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
  const isImpersonating = Boolean(session?.session?.impersonatedBy)
  const needsAttention = isImpersonating || user?.emailVerified !== true
  const attentionTitle = isImpersonating ? "Impersonation active" : "Action needed"

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-background md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="safe-area-bottom flex w-full flex-row items-center py-1">
        <div className="flex min-w-0 flex-1 justify-center">
          <Link
            href={askAiPath}
            aria-label="Ask AI"
            className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-1 transition-colors"
          >
            <span
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-sm",
                isAskAiActive && "bg-primary text-white"
              )}
            >
              <LogoSvg
                iconSize={24}
                className={cn(navIconClassName, isAskAiActive ? "text-white" : "text-muted-foreground")}
              />
            </span>
            <span
              className={cn(
                "max-w-full truncate text-xs leading-none font-semibold",
                isAskAiActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              Ask AI
            </span>
          </Link>
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          {session?.user?.email ? (
            <>
              <Sheet open={isAccountSheetOpen} onOpenChange={setIsAccountSheetOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="relative flex min-w-0 flex-col items-center justify-center gap-1.5 px-1 py-1 transition-colors"
                    aria-label="Account"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl">
                      <User className={cn(navIconClassName, "text-muted-foreground")} />
                    </span>
                    <span className="max-w-full truncate text-xs leading-none font-semibold text-muted-foreground">
                      Account
                    </span>
                    {needsAttention && (
                      <span
                        className={cn(
                          "absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-white",
                          isImpersonating ? "bg-destructive" : "bg-amber-500"
                        )}
                        title={attentionTitle}
                        aria-hidden
                      >
                        {isImpersonating ? (
                          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-destructive animation-duration-[2s]" />
                        ) : null}
                        <AlertCircle className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom">
                  <SheetHeader className="shrink-0 border-b border-border px-4 py-3">
                    <SheetTitle className="text-lg">Account</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-1 flex-col gap-1 px-4">
                    <div className="mb-2 flex items-center gap-3 rounded-lg text-muted-foreground">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {userInitials}
                      </div>
                      <div className="min-w-0 flex-1 truncate">
                        <p className="truncate font-medium text-foreground">{user?.name ?? "User"}</p>
                        {user?.email && <p className="truncate text-xs">{user.email}</p>}
                      </div>
                    </div>

                    {isImpersonating ? (
                      <Button
                        variant="destructive"
                        className="relative h-auto justify-start gap-3 overflow-visible rounded-lg font-semibold text-white!"
                        onClick={handleStopImpersonation}
                        disabled={isPending}
                      >
                        {!isPending ? (
                          <span className="absolute inset-0 -z-10 rounded-lg bg-destructive animation-duration-[2s]" />
                        ) : null}
                        <UserRoundCheck className="size-4 shrink-0 text-white!" />
                        <span>{isPending ? "Switching back..." : "Stop impersonation"}</span>
                      </Button>
                    ) : null}

                    <Button
                      variant="ghost"
                      className={cn(
                        "h-auto justify-start gap-3 rounded-lg p-3",
                        !isImpersonating && needsAttention && "bg-amber-500/10"
                      )}
                      onClick={() => {
                        setIsAccountSheetOpen(false)
                        setIsSettingsOpen(true)
                      }}
                    >
                      <Settings className="size-4 shrink-0" />
                      <span className="font-medium">Settings</span>
                      {!isImpersonating && needsAttention && (
                        <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-amber-600">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                          Action needed
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-auto justify-start gap-3 rounded-lg p-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={handleSignOut}
                      disabled={isPending}
                    >
                      <LogOut className="size-4 shrink-0" />
                      <span className="font-medium">{isPending ? "Logging out..." : "Log out"}</span>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
            </>
          ) : (
            <button
              type="button"
              onClick={handleSignInClick}
              className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-1 transition-colors"
              aria-label="Sign in"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl">
                <User className={cn(navIconClassName, "text-muted-foreground")} />
              </span>
              <span className="max-w-full truncate text-xs leading-none font-semibold text-muted-foreground">
                Account
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
