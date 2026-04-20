"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { headerMenuLinks } from "@/lib/web.routes"

export function HeaderMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prevState) => !prevState)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
      >
        {isOpen ? <X className="size-7" /> : <Menu className="size-7" />}
      </button>

      {isOpen ? (
        <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-[70vh] overflow-y-auto rounded-xl border border-border/75 bg-background px-2 py-4 shadow-lg">
          <ul className="grid grid-cols-1 gap-1">
            {headerMenuLinks.map((link) => (
              <li key={link.title}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
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
