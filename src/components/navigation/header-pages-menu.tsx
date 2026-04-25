"use client"

import { Route } from "next"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { isPathWithinRoute } from "@/lib/web.routes"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

type HeaderMenuLink = {
  title: string
  href: Route
}

type HeaderMenuSection = {
  links: readonly HeaderMenuLink[]
}

type HeaderPagesMenuProps = {
  menuSections: readonly HeaderMenuSection[]
}

export function HeaderPagesMenu({ menuSections }: HeaderPagesMenuProps) {
  const t = useTranslations("home.header")
  const pathname = usePathname()

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-semibold text-foreground/90">{t("allPages")}</NavigationMenuTrigger>
          <NavigationMenuContent className="top-14! rounded-2xl bg-background p-0">
            <div className="grid w-lg grid-cols-2 gap-x-3 px-2 py-4 lg:grid-cols-3">
              {menuSections.map((section, sectionIndex) => (
                <ul key={`section-${sectionIndex}`} className="space-y-1">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <NavigationMenuLink asChild className="py-2">
                        <Link
                          className={cn("font-medium", isPathWithinRoute(pathname, link.href) && "text-primary")}
                          href={link.href}
                        >
                          {link.title}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
