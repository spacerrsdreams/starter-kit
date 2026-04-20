"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { usePathname } from "next/navigation"
import * as React from "react"

import { isDashboardPath } from "@/lib/web.routes"

function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname()
  const forcedTheme = isDashboardPath(pathname) ? undefined : "light"

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
      forcedTheme={forcedTheme}
    >
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider }
