import { SparklesIcon } from "lucide-react"
import Link from "next/link"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { ClientHoc } from "@/components/client.hoc"
import { LogoIcon } from "@/components/ui/icons/logo"

interface LogoProps {
  showTitle?: boolean
}

export function SidebarLogo({ showTitle = true }: LogoProps) {
  return (
    <ClientHoc>
      <Link
        href={WebRoutes.root.path}
        className="flex items-center gap-2"
        aria-label={`Go to ${SiteConfig.name} home page`}
      >
        <LogoIcon />
        {showTitle && (
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">{SiteConfig.name}</span>
          </div>
        )}
      </Link>
    </ClientHoc>
  )
}
