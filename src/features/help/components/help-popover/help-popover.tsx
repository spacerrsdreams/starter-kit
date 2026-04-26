"use client"

import { ArrowUpRight, ChevronRight, CircleHelp, FileText, Info } from "lucide-react"
import { Route } from "next"
import Link from "next/link"

import { WebRoutes } from "@/lib/web.routes"
import type { HelpLinkItem } from "@/features/help/types/help.types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const helpLinks: readonly HelpLinkItem[] = [
  {
    label: "Help Center",
    href: WebRoutes.contact.path,
    icon: CircleHelp,
  },
  {
    label: "Terms of Service",
    href: WebRoutes.termsOfService.path,
    icon: FileText,
  },
  {
    label: "Privacy Policy",
    href: WebRoutes.privacyPolicy.path,
    icon: Info,
  },
] as const

export function HelpPopover() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-8 w-full justify-start rounded-md px-2 text-sm font-medium text-sidebar-foreground"
        >
          <CircleHelp className="mr-2.5 size-4" />
          Help
          <ChevronRight className="ml-auto size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start">
        {helpLinks.map((item, index) => (
          <div key={item.label}>
            <DropdownMenuItem asChild>
              <Link
                href={item.href as Route}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="group"
              >
                <item.icon />
                <span>{item.label}</span>
                <ArrowUpRight className="ml-auto size-4 translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </DropdownMenuItem>
            {index === 0 ? <DropdownMenuSeparator /> : null}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
