import { Send } from "lucide-react"
import Link from "next/link"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { FooterLinksSection } from "@/components/footer-links-section"
import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"
import { FacebookIcon } from "@/components/ui/icons/facebook.icon"
import { InstagramIcon } from "@/components/ui/icons/instagram.icon"
import { LinkedInIcon } from "@/components/ui/icons/linkedin.icon"
import { LogoIcon } from "@/components/ui/icons/logo.icon"

const infoLinks = [
  { label: "AI Page", href: WebRoutes.dashboard.path },
  { label: "Pricing", href: WebRoutes.pricing.path },
] as const

const resourcesLinks = [{ label: "Contact Us", href: WebRoutes.contact.path }] as const

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
    <footer className="bg-white px-6 md:px-0 dark:bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 md:flex-row md:gap-60">
        <BottomUpFadeAnimation delay={0.15}>
          <div className="space-y-5">
            <Link href={WebRoutes.root.path} className="flex items-center gap-3">
              <LogoIcon size={24} className="bg-accent-1" />
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
        </BottomUpFadeAnimation>

        <div className="grid grid-cols-1 gap-6 pb-12 sm:grid-cols-2 md:grid-cols-3">
          <BottomUpFadeAnimation delay={0.25}>
            <FooterLinksSection title="Info" links={infoLinks} />
          </BottomUpFadeAnimation>
          <BottomUpFadeAnimation delay={0.35}>
            <FooterLinksSection title="Resources" links={resourcesLinks} />
          </BottomUpFadeAnimation>
          <BottomUpFadeAnimation delay={0.45}>
            <FooterLinksSection title="Company" links={companyLinks} />
          </BottomUpFadeAnimation>
        </div>
      </div>
      <div className="mx-auto mt-6 border-t border-border/75 py-6">
        <BottomUpFadeAnimation delay={0.55}>
          <div className="mx-auto flex w-full max-w-6xl items-center justify-center p-6 text-sm font-medium text-foreground">
            <p>
              © {SiteConfig.copyrightYear} {SiteConfig.name}, Inc. All rights reserved.
            </p>
          </div>
        </BottomUpFadeAnimation>
      </div>
    </footer>
  )
}
