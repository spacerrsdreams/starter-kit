import Link from "next/link"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { LogoIcon } from "@/components/ui/icons/logo.icon"

interface LogoProps {
  showTitle?: boolean
}

export function NavLogo({ showTitle = true }: LogoProps) {
  return (
    <Link
      href={WebRoutes.root.path}
      className="flex items-center gap-2"
      aria-label={`Go to ${SiteConfig.name} home page`}
    >
      <LogoIcon size={16} className="bg-primary" />
      {showTitle && (
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-medium">{SiteConfig.name}</span>
        </div>
      )}
    </Link>
  )
}
