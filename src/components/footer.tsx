import { Send } from "lucide-react"
import { Route } from "next"
import { useTranslations } from "next-intl"
import Link from "next/link"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"
import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"
import { FacebookIcon } from "@/components/ui/icons/facebook.icon"
import { InstagramIcon } from "@/components/ui/icons/instagram.icon"
import { LinkedInIcon } from "@/components/ui/icons/linkedin.icon"
import { LogoIcon } from "@/components/ui/icons/logo.icon"

const socialLinks = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "LinkedIn", href: "#", icon: LinkedInIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Telegram", href: "#", icon: Send },
] as const

type FooterLink = {
  label: string
  href: string
}

type FooterLinksSectionProps = {
  title: string
  links: readonly FooterLink[]
}

export function FooterLinksSection({ title, links }: FooterLinksSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold tracking-wide text-foreground/80 uppercase">{title}</h3>
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href as Route}
            className="block text-sm text-foreground transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function Footer() {
  const t = useTranslations("home.footer")
  const infoLinks = [
    { label: t("links.aiPage"), href: WebRoutes.dashboard.path },
    { label: t("links.blog"), href: WebRoutes.blog.path },
    { label: t("links.pricing"), href: WebRoutes.pricing.path },
  ] as const
  const resourcesLinks = [{ label: t("links.contactUs"), href: WebRoutes.contact.path }] as const
  const companyLinks = [
    { label: t("links.termsAndConditions"), href: WebRoutes.termsOfService.path },
    { label: t("links.privacyPolicy"), href: WebRoutes.privacyPolicy.path },
  ] as const

  return (
    <footer className="bg-white px-6 lg:px-0 dark:bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col justify-start gap-12 md:flex-row lg:justify-between">
        <BottomUpFadeAnimation delay={0.15}>
          <div className="space-y-5">
            <Link href={WebRoutes.root.path} className="flex items-center gap-3">
              <LogoIcon iconSize={32} containerSize={36} className="bg-accent-1" />
              <span className="text-3xl font-semibold tracking-tighter text-foreground">{SiteConfig.name}</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("description", { name: SiteConfig.name })}
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
            <FooterLinksSection title={t("sections.info")} links={infoLinks} />
          </BottomUpFadeAnimation>
          <BottomUpFadeAnimation delay={0.35}>
            <FooterLinksSection title={t("sections.resources")} links={resourcesLinks} />
          </BottomUpFadeAnimation>
          <BottomUpFadeAnimation delay={0.45}>
            <FooterLinksSection title={t("sections.company")} links={companyLinks} />
          </BottomUpFadeAnimation>
        </div>
      </div>
      <div className="mx-auto mt-6 border-t border-border/75 py-6">
        <BottomUpFadeAnimation delay={0.55}>
          <div className="mx-auto flex w-full max-w-6xl items-center justify-center p-6 text-sm font-medium text-foreground">
            <p>{t("copyright", { year: SiteConfig.copyrightYear, name: SiteConfig.name })}</p>
          </div>
        </BottomUpFadeAnimation>
      </div>
    </footer>
  )
}
