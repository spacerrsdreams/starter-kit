import Link from "next/link"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { HeaderMobileMenu } from "@/components/header-mobile-menu"
import { HeaderPagesMenu } from "@/components/header-pages-menu"
import { Button } from "@/components/ui/button"
import { LogoIcon } from "@/components/ui/icons/logo.icon"

const navLinks = [{ label: "Pricing", href: WebRoutes.pricing.path }] as const

export function HeaderNavigation() {
  return (
    <header className="fixed top-2 left-1/2 z-50 w-full -translate-x-1/2 px-4">
      <nav className="mx-auto w-full max-w-4xl">
        <div className="shdadow-sm relative rounded-xl border border-border/75 bg-input/15 backdrop-blur-md">
          <div className="flex min-h-14.5 items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-8">
              <Link href={WebRoutes.root.path} className="flex items-center gap-2">
                <LogoIcon size={18} className="bg-accent-1" />
                <span className="text-xl font-semibold text-foreground">{SiteConfig.name}</span>
              </Link>

              <ul className="hidden items-center gap-7 md:flex">
                <li>
                  <HeaderPagesMenu />
                </li>
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-foreground/90 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden items-center gap-4 md:flex">
              <Button asChild className="h-10 rounded-full bg-background px-5 py-6 font-semibold" featureStylesEnabled>
                <Link href={WebRoutes.signUp.path}>Get Started</Link>
              </Button>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <HeaderMobileMenu />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
