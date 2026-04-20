import { Send } from "lucide-react"
import Link from "next/link"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { FacebookIcon } from "@/components/ui/icons/facebook.icon"
import { InstagramIcon } from "@/components/ui/icons/instagram.icon"
import { LinkedInIcon } from "@/components/ui/icons/linkedin.icon"
import { LogoIcon } from "@/components/ui/icons/logo.icon"

const infoLinks = [
  { label: "AI Page", href: WebRoutes.askAi.path },
  { label: "Contact", href: WebRoutes.contact.path },
  { label: "Pricing", href: WebRoutes.pricing.path },
] as const

const companyLinks = [
  { label: "Terms and Conditions", href: WebRoutes.termsOfService.path },
  { label: "Privacy Policy", href: WebRoutes.privacyPolicy.path },
] as const

const socialLinks = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "LinkedIn", href: "#", icon: LinkedInIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Telegram", href: "#", icon: Send },
] as const

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-white dark:bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-5">
          <Link href={WebRoutes.root.path} className="flex items-center gap-3">
            <LogoIcon size={14} />
            <span className="text-3xl font-semibold tracking-tight text-foreground">{SiteConfig.name}</span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {SiteConfig.name} helps teams work faster with practical AI workflows and a modern dashboard.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((socialLink) => {
              const Icon = socialLink.icon

              return (
                <Link
                  key={socialLink.label}
                  href={socialLink.href}
                  aria-label={socialLink.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-wide text-foreground/80 uppercase">Info</h3>
          <div className="space-y-2">
            {infoLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-wide text-foreground/80 uppercase">Company</h3>
          <div className="space-y-2">
            {companyLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-6 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {SiteConfig.name}, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
