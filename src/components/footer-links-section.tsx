import { Route } from "next"
import Link from "next/link"

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
