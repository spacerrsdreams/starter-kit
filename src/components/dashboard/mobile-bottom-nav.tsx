"use client"

import {
  AlertCircle,
  BookMarked,
  CircleDollarSign,
  LogOut,
  MessageCircle,
  Settings,
  ShieldCheck,
  User,
  UserRoundCheck,
} from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { cn } from "@/lib/utils"
import { isPathWithinRoute, WebRoutes } from "@/lib/web.routes"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { authClient } from "@/features/auth/lib/auth-client"
import { SettingsDialog } from "@/features/settings/components/settings-dialog/settings-dialog"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function MobileBottomNav() {
  const t = useTranslations()
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const authModalContext = useAuthRequiredModal()
  const [isPending, startTransition] = useTransition()
  const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const user = session?.user

  const chatPath = WebRoutes.dashboard.path
  const isChatActive = isPathWithinRoute(pathname, chatPath)
  const isAdminActive = isPathWithinRoute(pathname, WebRoutes.admin.path)
  const isBlogActive = isPathWithinRoute(pathname, WebRoutes.blog.path)
  const isPricingActive = isPathWithinRoute(pathname, WebRoutes.pricing.path)
  const hasAdminAccess = session?.user?.role === "admin"

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

  const userInitials = (user?.name ?? t("dashboard.mobileBottomNav.userFallback"))
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
  const isImpersonating = Boolean(session?.session?.impersonatedBy)
  const needsAttention = isImpersonating || user?.emailVerified !== true
  const attentionTitle = isImpersonating
    ? t("dashboard.mobileBottomNav.impersonationActive")
    : t("dashboard.mobileBottomNav.actionNeeded")

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-background md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="safe-area-bottom flex w-full flex-row items-center py-1">
        <div className="flex min-w-0 flex-1 justify-center">
          <Link
            href={chatPath}
            aria-label={t("routes.chat")}
            className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-1 transition-colors"
          >
            <span
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-sm",
                isChatActive && "bg-primary text-white"
              )}
            >
              <MessageCircle className={cn(navIconClassName, isChatActive ? "text-white" : "text-muted-foreground")} />
            </span>
            <span
              className={cn(
                "max-w-full truncate text-xs leading-none font-semibold",
                isChatActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {t("routes.chat")}
            </span>
          </Link>
        </div>
        {hasAdminAccess ? (
          <div className="flex min-w-0 flex-1 justify-center">
            <Link
              href={WebRoutes.admin.path}
              aria-label={t("routes.admin")}
              className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-1 transition-colors"
            >
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-sm",
                  isAdminActive && "bg-primary text-white"
                )}
              >
                <ShieldCheck className={cn(navIconClassName, isAdminActive ? "text-white" : "text-muted-foreground")} />
              </span>
              <span
                className={cn(
                  "max-w-full truncate text-xs leading-none font-semibold",
                  isAdminActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {t("routes.admin")}
              </span>
            </Link>
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 justify-center">
          <Link
            href={WebRoutes.blog.path}
            aria-label={t("routes.blog")}
            className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-1 transition-colors"
          >
            <span
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-sm",
                isBlogActive && "bg-primary text-white"
              )}
            >
              <BookMarked className={cn(navIconClassName, isBlogActive ? "text-white" : "text-muted-foreground")} />
            </span>
            <span
              className={cn(
                "max-w-full truncate text-xs leading-none font-semibold",
                isBlogActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {t("routes.blog")}
            </span>
          </Link>
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          <Link
            href={WebRoutes.pricing.path}
            aria-label={t("routes.pricing")}
            className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-1 transition-colors"
          >
            <span
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-sm",
                isPricingActive && "bg-primary text-white"
              )}
            >
              <CircleDollarSign className={cn(navIconClassName, isPricingActive ? "text-white" : "text-muted-foreground")} />
            </span>
            <span
              className={cn(
                "max-w-full truncate text-xs leading-none font-semibold",
                isPricingActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {t("routes.pricing")}
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
                    aria-label={t("dashboard.mobileBottomNav.account")}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl">
                      <User className={cn(navIconClassName, "text-muted-foreground")} />
                    </span>
                    <span className="max-w-full truncate text-xs leading-none font-semibold text-muted-foreground">
                      {t("dashboard.mobileBottomNav.account")}
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
                    <SheetTitle className="text-lg">{t("dashboard.mobileBottomNav.account")}</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-1 flex-col gap-1 px-4">
                    <div className="mb-2 flex items-center gap-3 rounded-lg text-muted-foreground">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {userInitials}
                      </div>
                      <div className="min-w-0 flex-1 truncate">
                        <p className="truncate font-medium text-foreground">
                          {user?.name ?? t("dashboard.mobileBottomNav.userFallback")}
                        </p>
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
                        <span>
                          {isPending ? t("dashboard.switchingBack") : t("dashboard.stopImpersonation")}
                        </span>
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
                      <span className="font-medium">{t("dashboard.mobileBottomNav.settings")}</span>
                      {!isImpersonating && needsAttention && (
                        <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-amber-600">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                          {t("dashboard.mobileBottomNav.actionNeeded")}
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
                      <span className="font-medium">
                        {isPending ? t("dashboard.mobileBottomNav.loggingOut") : t("dashboard.mobileBottomNav.logOut")}
                      </span>
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
              aria-label={t("routes.signIn")}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl">
                <User className={cn(navIconClassName, "text-muted-foreground")} />
              </span>
              <span className="max-w-full truncate text-xs leading-none font-semibold text-muted-foreground">
                {t("dashboard.mobileBottomNav.account")}
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
