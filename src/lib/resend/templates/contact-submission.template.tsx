import { Body, Container, Head, Html, Preview, Section, Tailwind, Text } from "@react-email/components"

interface ContactSubmissionEmailTemplateProps {
  submitterName: string
  email: string
  subject: string
  message: string
}

export function ContactSubmissionEmailTemplate({
  submitterName,
  email,
  subject,
  message,
}: ContactSubmissionEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-2.5 font-sans text-[#404040]">
          <Preview>New contact form submission</Preview>
          <Container className="mx-auto max-w-[560px] border border-solid border-[#f0f0f0] bg-white px-6 py-8">
            <Text className="mt-0 text-xl font-medium">New contact form submission</Text>

            <Section className="mt-4">
              <Text className="my-1 text-sm">
                <strong>From:</strong> {submitterName}
              </Text>
              <Text className="my-1 text-sm">
                <strong>Email:</strong> {email}
              </Text>
              <Text className="my-1 text-sm">
                <strong>Subject:</strong> {subject}
              </Text>
            </Section>

            <Section className="mt-6">
              <Text className="mb-2 text-sm font-medium">Message</Text>
              <Text className="m-0 whitespace-pre-wrap text-sm leading-relaxed">{message}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
