import { WebRoutes } from "@/lib/web.routes"

export function shouldHideAiWidget(pathname: string) {
  const isAskAiRoute = pathname === WebRoutes.dashboard.path || pathname.startsWith(`${WebRoutes.dashboard.path}/`)
  const isAuthRoute =
    pathname === WebRoutes.signIn.path ||
    pathname === WebRoutes.signUp.path ||
    pathname === WebRoutes.resetPassword.path
  const isMarketingRoute = pathname === WebRoutes.root.path

  return isAskAiRoute || isAuthRoute || isMarketingRoute
}
