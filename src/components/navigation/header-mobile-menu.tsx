"use client"

import { Menu, X } from "lucide-react"
import { Route } from "next"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { isPathWithinRoute } from "@/lib/web.routes"
import { cn } from "@/lib/utils"

type HeaderMenuLink = {
  title: string
  href: Route
}

type HeaderMobileMenuProps = {
  menuLinks: readonly HeaderMenuLink[]
}

export function HeaderMobileMenu({ menuLinks }: HeaderMobileMenuProps) {
  const t = useTranslations("home.header")
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prevState) => !prevState)}
        aria-label={isOpen ? t("mobileCloseMenu") : t("mobileOpenMenu")}
        aria-expanded={isOpen}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
      >
        {isOpen ? <X className="size-7" /> : <Menu className="size-7" />}
      </button>

      {isOpen ? (
        <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-[70vh] overflow-y-auto rounded-xl border border-border/75 bg-background px-2 py-4 shadow-lg">
          <ul className="grid grid-cols-1 gap-1">
            {menuLinks.map((link) => (
              <li key={link.title}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded-md px-2 py-2.5 text-sm font-medium transition-colors hover:bg-muted/60",
                    isPathWithinRoute(pathname, link.href) ? "text-primary" : "text-foreground"
                  )}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  )
}
