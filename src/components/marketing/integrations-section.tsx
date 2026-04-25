import { Database, Layers3, PlugZap } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ComponentType } from "react"
import {
  SiBetterauth,
  SiNextdotjs,
  SiPosthog,
  SiPrisma,
  SiResend,
  SiShadcnui,
  SiStripe,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si"

import { SectionHeading } from "@/components/section-heading"
import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type IntegrationCard = {
  key: string
  icon: ComponentType<{ className?: string }>
}

const integrationCards: readonly IntegrationCard[] = [
  { key: "nextjs", icon: SiNextdotjs }, // Row 1 - Foundation
  { key: "typescript", icon: SiTypescript },
  { key: "tailwind", icon: SiTailwindcss },
  { key: "vercelAiSdk", icon: SiVercel }, // Row 2 - Differentiators
  { key: "betterAuth", icon: SiBetterauth },
  { key: "prisma", icon: SiPrisma },
  { key: "stripe", icon: SiStripe }, // Row 3 - Infrastructure
  { key: "neon", icon: Database },
  { key: "tanstack", icon: Layers3 },
  { key: "shadcn", icon: SiShadcnui }, // Row 4 - Polish
  { key: "resend", icon: SiResend },
  { key: "posthog", icon: SiPosthog },
] as const

export function IntegrationsSection() {
  const t = useTranslations("home.integrations")

  return (
    <section className="mx-auto mt-20 w-full max-w-5xl py-6 md:py-10">
      <BottomUpFadeAnimation>
        <SectionHeading
          chipIcon={PlugZap}
          chipText={t("chip")}
          title={t("title")}
          description={t("description")}
          titleClassName="px-4 lg:px-0"
          descriptionClassName="max-w-xs text-muted-foreground md:max-w-2xl"
        />
      </BottomUpFadeAnimation>

      <div className="mt-10 grid gap-6 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-0">
        {integrationCards.map((integration, index) => {
          const Icon = integration.icon
          return (
            <BottomUpFadeAnimation key={integration.key} delay={0.08 + index * 0.06}>
              <Card className="h-full bg-sidebar">
                <CardHeader className="gap-0 px-4 py-4">
                  <Icon className="size-7" />
                  <CardTitle className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                    {t(`items.${integration.key}.title`)}
                  </CardTitle>
                  <CardDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`items.${integration.key}.description`)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </BottomUpFadeAnimation>
          )
        })}
      </div>
    </section>
  )
}
