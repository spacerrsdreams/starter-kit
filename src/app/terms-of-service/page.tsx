import { SiteConfig } from "@/lib/site.config"
import { Footer } from "@/components/footer"
import { HeaderNavigationClient } from "@/components/header-navigation.client"
import { LegalSectionBlock } from "@/components/legal/legal-section-block"
import { TopGradient } from "@/components/top-gradient"
import { BlurWaveTextAnimation } from "@/components/ui/blur-wave-text.animation"
import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"

const TermsOfServiceSections = [
  {
    title: `Terms & Conditions for Using ${SiteConfig.name}`,
    description: `Welcome to ${SiteConfig.name}! These Terms & Conditions govern your use of our CRM Management SaaS platform and associated services. By accessing or using ${SiteConfig.name}, you agree to be bound by the following terms. Please read them carefully.`,
  },
  {
    title: "1. Acceptance of Terms",
    description: `By registering or using ${SiteConfig.name}, you accept these Terms & Conditions in full. If you do not agree with any part of these terms, you are prohibited from using our services.`,
  },
  {
    title: "2. User Responsibilities",
    description: `As a ${SiteConfig.name} user, you are responsible for maintaining the confidentiality of your account credentials and ensuring all activities under your account comply with these terms. Misuse, unauthorized access, or malicious activities may result in immediate account suspension or termination.`,
  },
  {
    title: "3. Acceptable Use of Services",
    description: `${SiteConfig.name} is designed to improve CRM management and customer engagement. You agree to use the platform solely for lawful purposes and in accordance with its intended functionality. You must not interfere with or disrupt the service, servers, or networks connected to the platform.`,
  },
  {
    title: "4. Subscription & Payment",
    description: `${SiteConfig.name} operates on a subscription-based model. By subscribing, you agree to pay all fees associated with your selected plan on time. Failure to pay may result in suspension or permanent termination of your account.`,
  },
  {
    title: "5. AI Generation Billing & Refund Policy",
    description: `If an AI generation request fails due to a verified technical error on ${SiteConfig.name} — including system, processing, or provider-side failures — you will not be charged for that request, or you will receive an equivalent credit or refund where applicable. Refunds are not issued on the basis of dissatisfaction with the content quality, style, tone, or outcome of a successfully completed generation.`,
  },
  {
    title: "6. Refund Request Process",
    description: `To request a billing review for a failed generation, contact our support team within a reasonable timeframe and provide sufficient details for verification. ${SiteConfig.name} reserves the right to deny refund requests where server logs confirm the generation completed successfully, or where account misuse, abuse, or policy violations are identified.`,
  },
  {
    title: "7. Data Privacy",
    description: `We are committed to protecting your data privacy and security. By using ${SiteConfig.name}, you consent to the collection, use, and storage of your data as described in our Privacy Policy. You retain full ownership of your data; however, you grant ${SiteConfig.name} a limited license to process it solely as required to deliver the service.`,
  },
  {
    title: "8. Intellectual Property",
    description: `All intellectual property rights in ${SiteConfig.name} — including software, branding, and content — are owned by ${SiteConfig.name} or its licensors. You are granted a limited, non-exclusive license to use the platform for its intended purpose. You may not modify, distribute, reverse-engineer, or reproduce any part of the platform without prior written permission.`,
  },
  {
    title: "9. Limitation of Liability",
    description: `${SiteConfig.name} is provided "as is" without warranties of any kind, express or implied. To the fullest extent permitted by applicable law, we are not liable for any indirect, incidental, special, or consequential damages arising from your use of — or inability to use — the platform.`,
  },
  {
    title: "10. Termination of Service",
    description: `We reserve the right to suspend or permanently terminate your access to ${SiteConfig.name} at our sole discretion, including for violations of these Terms & Conditions, non-payment of fees, or conduct deemed harmful to other users or the platform.`,
  },
  {
    title: "11. Modifications to Terms",
    description: `${SiteConfig.name} reserves the right to update or modify these Terms & Conditions at any time without prior notice. Any changes will be effective upon posting. Continued use of the platform following such changes constitutes your acceptance of the revised terms.`,
  },
  {
    title: "12. Governing Law",
    description: `These Terms & Conditions are governed by and construed in accordance with the laws of the jurisdiction in which ${SiteConfig.name} operates. Any disputes arising under these terms will be subject to the exclusive jurisdiction of the courts in that jurisdiction.`,
  },
  {
    title: "13. Acknowledgement",
    description: `By using ${SiteConfig.name}, you confirm that you have read, understood, and agree to be bound by these Terms & Conditions. If you have any questions or concerns, please don't hesitate to reach out to our support team.`,
  },
]

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-background">
      <TopGradient />
      <HeaderNavigationClient />
      <main className="mx-auto w-full max-w-5xl px-4 py-30 sm:px-6 md:py-45">
        <div className="flex items-center justify-center">
          <BlurWaveTextAnimation
            className="text-3xl font-semibold tracking-[-3.5px] text-foreground sm:text-6xl"
            text="Terms & Conditions"
          />
        </div>
        <BottomUpFadeAnimation>
          <p className="mt-4 text-center leading-4 font-semibold tracking-wide text-muted-foreground">
            Last updated: April 21, 2026
          </p>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation>
          <div className="mt-20 space-y-16">
            {TermsOfServiceSections.map((section) => (
              <LegalSectionBlock key={section.title} title={section.title} description={section.description} />
            ))}
          </div>
        </BottomUpFadeAnimation>
      </main>
      <Footer />
    </div>
  )
}
