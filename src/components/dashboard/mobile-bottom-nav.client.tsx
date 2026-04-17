"use client"

import { AlertCircle, LogOut, Settings, SparklesIcon, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useTransition } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"
import { WebRoutes } from "@/lib/web.routes"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { SettingsDialog } from "@/features/settings/components/settings-dialog/settings-dialog"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function MobileBottomNav() {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const authModalContext = useAuthRequiredModal()
  const [isPending, startTransition] = useTransition()
  const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const user = session?.user

  const isActive = (path: string) => {
    return pathname.startsWith(path)
  }

  const iconClassName = "size-6"

  const navLinkClassName = (path: string) =>
    cn(
      "flex flex-col items-center justify-center gap-1 rounded-lg px-3.5 py-2.5 transition-colors",
      isActive(path) ? "bg-primary text-white" : "text-foreground hover:bg-muted/50"
    )

  const handleSignInClick = () => {
    authModalContext?.openAuthModal()
  }

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut()
    })
  }

  const userInitials = (user?.name ?? "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
  const needsAttention = user?.emailVerified !== true
  const attentionTitle = "Action needed"

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-sidebar-accent bg-sidebar md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="safe-area-bottom flex w-full flex-row items-center pt-2.5 pb-1.5">
        <div className="flex min-w-0 flex-1 justify-center">
          <Link href={WebRoutes.askAi.path} className={navLinkClassName(WebRoutes.askAi.path)} aria-label="Ask AI">
            <SparklesIcon className={cn(iconClassName, isActive(WebRoutes.askAi.path) && "text-white")} />
          </Link>
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          {session?.user?.email ? (
            <>
              <Sheet open={isAccountSheetOpen} onOpenChange={setIsAccountSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="relative h-auto rounded-lg px-3.5 py-2.5 text-foreground hover:bg-muted/50"
                    aria-label="Account"
                  >
                    <User className={iconClassName} />
                    {needsAttention && (
                      <span
                        className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white"
                        title={attentionTitle}
                        aria-hidden
                      >
                        <AlertCircle className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </Button>
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

                    <Button
                      variant="ghost"
                      className={cn("h-auto justify-start gap-3 rounded-lg p-3", needsAttention && "bg-amber-500/10")}
                      onClick={() => {
                        setIsAccountSheetOpen(false)
                        setIsSettingsOpen(true)
                      }}
                    >
                      <Settings className="size-4 shrink-0" />
                      <span className="font-medium">Settings</span>
                      {needsAttention && (
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
            <Button
              type="button"
              onClick={handleSignInClick}
              variant="ghost"
              className="h-auto rounded-lg px-3.5 py-2.5 text-foreground hover:bg-muted/50"
              aria-label="Sign in"
            >
              <User className={iconClassName} />
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
