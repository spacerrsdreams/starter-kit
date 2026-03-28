import { Body, Button, Container, Head, Html, Img, Preview, Section, Tailwind, Text } from "@react-email/components"

import { SiteConfig } from "@/lib/site.config"
import { WebRoutes } from "@/lib/web.routes"

interface ResetPasswordEmailTemplateProps {
  userFirstname?: string
  resetPasswordLink?: string
}

function getDefaultMessages(name: string) {
  return {
    preview: `${name} reset your password`,
    hi: "Hi {userFirstname},",
    intro: `Someone recently requested a password change for your ${name} account. If this was you, you can set a new password here:`,
    resetButton: "Reset password",
    ignore: "If you don't want to change your password or didn't request this, just ignore and delete this message.",
    signature: `Best regards,\nThe ${name} Team`,
  }
}

export const ResetPasswordEmailTemplate = ({ userFirstname, resetPasswordLink }: ResetPasswordEmailTemplateProps) => {
  const m = getDefaultMessages(SiteConfig.name)
  const hiText = m.hi.replace("{userFirstname}", userFirstname ?? "")

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-2.5">
          <Preview>{m.preview}</Preview>
          <Container className="border border-solid border-[#f0f0f0] bg-white p-[45px]">
            <Img
              src={`${WebRoutes.root.withBaseUrl()}/favicon-32x32.png`}
              width="40"
              height="33"
              alt={SiteConfig.name}
            />
            <Section>
              <Text className="font-dropbox text-base leading-[26px] font-light text-[#404040]">{hiText}</Text>
              <Text className="font-dropbox text-base leading-[26px] font-light text-[#404040]">{m.intro}</Text>
              <Button
                className="font-dropbox-sans block w-[210px] rounded bg-[#3c83f6] px-[7px] py-[14px] text-center text-[15px] text-white no-underline"
                href={resetPasswordLink}
              >
                {m.resetButton}
              </Button>
              <Text className="font-dropbox text-base leading-[26px] font-light text-[#404040]">{m.ignore}</Text>
              <Text className="font-dropbox text-base leading-[26px] font-light text-[#404040]">
                {m.signature.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ResetPasswordEmailTemplate.PreviewProps = {
  userFirstname: "",
  resetPasswordLink: "",
} as ResetPasswordEmailTemplateProps
