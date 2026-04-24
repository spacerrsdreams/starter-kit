"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

import { Route } from "next"
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

type HeaderPagesMenuProps = {
  menuLinks: readonly HeaderMenuLink[]
}

export function HeaderPagesMenu({ menuLinks }: HeaderPagesMenuProps) {
  const t = useTranslations("home.header")

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-semibold text-foreground/90">{t("allPages")}</NavigationMenuTrigger>
          <NavigationMenuContent className="top-14! rounded-2xl bg-background p-0">
            <ul className="grid w-100 grid-cols-2 gap-x-1 gap-y-1 px-2 py-4">
              {menuLinks.map((link) => (
                <li key={link.title}>
                  <NavigationMenuLink asChild className="">
                    <Link href={link.href}>{link.title}</Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
