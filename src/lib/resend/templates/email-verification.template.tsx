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

interface EmailVerificationEmailTemplateProps {
  firstName?: string
  url?: string
}

function getDefaultMessages() {
  return {
    preview: "Verify your email address to complete your account setup",
    title: "Please verify your email address to complete your account setup.",
    hey: "Hey",
    thanks:
      "Thanks for signing up! Please verify your email address by clicking the button below. This link will expire in 24 hours.",
    verifyButton: "Verify your email",
    copyLink: "Can't click the button? Copy this link",
    ignore: "If you didn't create an account, you can safely ignore this email.",
  }
}

export const EmailVerificationEmailTemplate = ({ firstName, url }: EmailVerificationEmailTemplateProps) => {
  const m = getDefaultMessages()

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-github bg-white text-[#24292e]">
          <Preview>{m.preview}</Preview>
          <Container className="mx-auto my-0 max-w-[480px] px-0 pt-5 pb-12">
            <Img
              src={`${WebRoutes.root.withBaseUrl()}/favicon-32x32.png`}
              width="32"
              height="32"
              alt={SiteConfig.name}
            />

            <Text className="text-2xl leading-tight">
              {firstName ? (
                <>
                  <strong>{firstName}</strong>,{" "}
                </>
              ) : null}
              {m.title}
            </Text>

            <Section className="rounded-[5px] border border-solid border-[#dedede] p-6 text-center">
              <Text className="mt-0 mb-[10px] text-left">
                {m.hey} <strong>{firstName}</strong>!
              </Text>
              <Text className="mt-0 mb-[10px] text-left">{m.thanks}</Text>

              <Button href={url} className="rounded-lg bg-[#3c83f6] px-6 py-3 text-sm leading-normal text-white">
                {m.verifyButton}
              </Button>
            </Section>
            <Text className="text-center">
              <Link href={url} className="text-[12px] text-[#3c83f6]">
                {m.copyLink}
              </Link>
            </Text>

            <Text className="mt-[60px] mb-4 text-center text-xs leading-[24px] text-[#6a737d]">{m.ignore}</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

EmailVerificationEmailTemplate.PreviewProps = {
  firstName: "",
  url: "",
} as EmailVerificationEmailTemplateProps
