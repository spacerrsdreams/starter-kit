"use client"

import { motion } from "motion/react"
import { Route } from "next"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes, isPathWithinRoute } from "@/lib/web.routes"
import { cn } from "@/lib/utils"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"
import { authClient } from "@/features/auth/lib/auth-client"
import { HeaderMobileMenu } from "@/components/navigation/header-mobile-menu"
import { HeaderPagesMenu } from "@/components/navigation/header-pages-menu"
import { Button } from "@/components/ui/button"
import { LogoIcon } from "@/components/ui/icons/logo.icon"

const HEADER_HIDE_OFFSET = 24

export function HeaderNavigationClient() {
  const t = useTranslations("home.header")
  const pathname = usePathname()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const { data: session } = authClient.useSession()
  const { openAuthModal } = useAuthRequiredModal()

  useEffect(() => {
    let previousScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isScrollingDown = currentScrollY > previousScrollY
      const shouldHide = isScrollingDown && currentScrollY > HEADER_HIDE_OFFSET

      setIsVisible(!shouldHide)
      previousScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [{ label: t("pricing"), href: WebRoutes.pricing.path }] as const

  const menuSections = [
    {
      links: [
        { title: t("menu.landing"), href: WebRoutes.root.path },
        { title: t("menu.dashboard"), href: WebRoutes.dashboard.path },
        { title: t("menu.blog"), href: WebRoutes.blog.path },
      ],
    },
    {
      links: [
        { title: t("pricing"), href: WebRoutes.pricing.path },
        { title: t("menu.pricingV2"), href: "/pricing-v2" as Route },
        { title: t("menu.integrations"), href: WebRoutes.integrations.path },
      ],
    },
    {
      links: [
        { title: t("menu.contact"), href: WebRoutes.contact.path },
        { title: t("menu.termsAndConditions"), href: WebRoutes.termsOfService.path },
        { title: t("menu.privacyPolicy"), href: WebRoutes.privacyPolicy.path },
        { title: t("menu.notFound"), href: "/definitely-not-existing-page" as Route },
      ],
    },
  ] as const

  const menuLinks = menuSections.flatMap((section) => section.links)

  return (
    <motion.header
      className="fixed top-4 left-1/2 z-50 w-full -translate-x-1/2 px-4 sm:top-2"
      animate={{
        y: isVisible ? 0 : -88,
        opacity: isVisible ? 1 : 0.5,
      }}
      transition={{
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <nav className="mx-auto w-full max-w-4xl">
        <div className="shdadow-sm relative rounded-xl border border-border/75 bg-sidebar">
          <div className="flex min-h-14.5 items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-8">
              <Link href={WebRoutes.root.path} className="flex items-center gap-2">
                <LogoIcon />
                <span className="text-xl font-semibold tracking-tighter text-foreground">{SiteConfig.name}</span>
              </Link>

              <ul className="hidden items-center gap-4 md:flex">
                <li>
                  <HeaderPagesMenu menuSections={menuSections} />
                </li>
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "inline-flex h-9 items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-all hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1",
                        isPathWithinRoute(pathname, link.href) ? "text-primary" : "text-foreground/90"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden items-center gap-4 md:flex">
              <Button
                className="h-10 rounded-full bg-foreground px-5 py-6 font-semibold hover:bg-foreground/90!"
                featureStylesEnabled
                onClick={() => {
                  if (session?.user) {
                    router.push(WebRoutes.dashboard.path)
                  } else {
                    openAuthModal()
                  }
                }}
              >
                {t("cta")}
              </Button>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <HeaderMobileMenu menuLinks={menuLinks} />
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
