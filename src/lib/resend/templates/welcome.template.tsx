import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"

interface WelcomeEmailTemplateProps {
  firstName?: string
}

function getDefaultMessages(name: string) {
  return {
    preview: `Welcome to ${name}`,
    welcomeTitle: "Welcome",
    thanks: `Hey${name ? `, thanks for signing up on ${name}` : ""}! We are thrilled to have you here.`,
    openApp: `Open ${name}`,
    ignoreEmail: "If you didn't create an account, you can ignore this email.",
    unsubscribe: "Unsubscribe from these emails",
  }
}

export const WelcomeEmailTemplate = ({ firstName }: WelcomeEmailTemplateProps) => {
  const m = getDefaultMessages(SiteConfig.name)

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-2.5 font-sans text-[#404040]">
          <Preview>{m.preview}</Preview>
          <Container className="mx-auto max-w-[480px] border border-solid border-[#f0f0f0] bg-white px-6 py-8">
            <Img
              src={`${WebRoutes.root.withBaseUrl()}/favicon-32x32.png`}
              width="32"
              height="32"
              alt={SiteConfig.name}
            />

            <Text className="mt-4 text-xl font-medium">
              {m.welcomeTitle} {firstName === "Anonymous" ? "" : `${firstName}!`}
            </Text>
            <Text className="mt-2 leading-relaxed">{m.thanks}</Text>

            <Section className="mt-6 text-center">
              <Button
                href={WebRoutes.root.withBaseUrl()}
                className="rounded-lg bg-[#3c83f6] px-6 py-3 text-sm font-medium text-white no-underline"
              >
                {m.openApp}
              </Button>
            </Section>

            <Text className="mt-8 text-center text-xs text-[#6a737d]">{m.ignoreEmail}</Text>

            <Text className="mt-4 text-center text-[11px] text-[#8b949e]">
              <Link href={WebRoutes.emailUnsubscribe.withBaseUrl()} className="text-[#8b949e] underline">
                {m.unsubscribe}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

WelcomeEmailTemplate.PreviewProps = {
  firstName: "",
  unsubscribeUrl: "#",
} as WelcomeEmailTemplateProps
