import { SiteConfig } from "@/lib/site.config"
import { Footer } from "@/components/footer"
import { HeaderNavigationClient } from "@/components/header-navigation.client"
import { LegalSectionBlock } from "@/components/legal/legal-section-block"
import { TopGradient } from "@/components/top-gradient"
import { BlurWaveTextAnimation } from "@/components/ui/blur-wave-text.animation"
import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"

const PrivacyPolicySections = [
  {
    title: `Privacy Policy for ${SiteConfig.name}`,
    description: `This Privacy Policy explains how ${SiteConfig.name} collects, uses, stores, and protects your information when you use our platform and services. By using ${SiteConfig.name}, you agree to the practices described below.`,
  },
  {
    title: "1. Information We Collect",
    description:
      "We may collect the following categories of information: account and profile details (such as name and email address), billing and payment information processed via Stripe, service usage and interaction data, device and browser information (such as IP address, browser type, and operating system), and communications you send to our support team.",
  },
  {
    title: "2. How We Use Your Information",
    description: `We use your information to operate and deliver ${SiteConfig.name}, process payments securely through Stripe, send transactional and service emails via Resend, analyze product usage and performance through PostHog, store and manage your data securely on Neon hosted infrastructure, and communicate important service updates or changes.`,
  },
  {
    title: "3. Third-Party Service Providers",
    description: `We work with the following trusted third-party providers to operate ${SiteConfig.name}: Stripe (payment processing — stripe.com/privacy), Neon (database hosting — neon.tech/privacy), Vercel (application hosting and deployment — vercel.com/legal/privacy-policy), PostHog (product analytics — posthog.com/privacy), Resend (transactional email delivery — resend.com/legal/privacy-policy), and Google (authentication and infrastructure services — policies.google.com/privacy). Each provider processes only the data necessary for their function and is bound by appropriate data protection agreements.`,
  },
  {
    title: "4. No Sale of Personal Data",
    description: `We do not sell, rent, or trade your personal data. ${SiteConfig.name} does not exchange your personal information for monetary or other consideration with any third party.`,
  },
  {
    title: "5. Payment Data",
    description: `All payment processing is handled exclusively by Stripe. ${SiteConfig.name} does not store or have access to your full card details. Stripe collects and processes billing information directly in accordance with their Privacy Policy at stripe.com/privacy. By making a payment, you also agree to Stripe's terms.`,
  },
  {
    title: "6. Analytics and Tracking",
    description: `We use PostHog to collect anonymized usage and behavioral analytics to understand how users interact with ${SiteConfig.name} and to improve the product. We may also use cookies and similar technologies to keep you signed in, remember preferences, and measure platform usage. You can manage cookie preferences through your browser settings.`,
  },
  {
    title: "7. Email Communications",
    description: `Transactional emails (such as account confirmations, password resets, and billing receipts) are delivered through Resend. We do not use your email address for unsolicited marketing without your explicit consent.`,
  },
  {
    title: "8. Data Storage and Hosting",
    description: `Your data is stored in Neon's managed PostgreSQL database infrastructure and deployed via Vercel. Both providers maintain industry-standard security practices. Data may be processed in the United States or other jurisdictions where these providers operate.`,
  },
  {
    title: "9. Data Security",
    description: `We implement administrative, technical, and organizational safeguards to protect your data from unauthorized access, loss, or misuse. However, no system is completely secure — we encourage you to use a strong password and keep your credentials confidential.`,
  },
  {
    title: "10. Data Retention",
    description: `We retain your personal data only for as long as necessary to provide the service, fulfill legal obligations, resolve disputes, and enforce our agreements. When data is no longer required, it is securely deleted or anonymized.`,
  },
  {
    title: "11. Your Rights and Choices",
    description: `Depending on your jurisdiction, you may have the right to access, correct, delete, or export your personal data, and to object to or restrict certain processing activities. US residents may have additional rights under applicable state privacy laws (such as CCPA). EU/EEA residents have rights under GDPR. To exercise any of these rights, please contact our support team.`,
  },
  {
    title: "12. International Data Transfers",
    description: `${SiteConfig.name} operates globally. Your data may be transferred to and processed in countries outside your own, including the United States, where our third-party providers (Stripe, Vercel, Neon, PostHog, Resend) are based. We ensure appropriate safeguards are in place for any such transfers.`,
  },
  {
    title: "13. Policy Updates",
    description: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes where required. Continued use of ${SiteConfig.name} after updates constitutes acceptance of the revised policy.`,
  },
  {
    title: "14. Contact",
    description: `If you have any privacy-related questions, requests, or concerns, please contact the ${SiteConfig.name} support team. We will respond as promptly as possible and within any timeframes required by applicable law.`,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopGradient />
      <HeaderNavigationClient />
      <main className="mx-auto w-full max-w-5xl px-4 py-30 sm:px-6 md:py-45">
        <div className="flex items-center justify-center">
          <BlurWaveTextAnimation className="text-3xl font-semibold text-foreground sm:text-6xl" text="Privacy Policy" />
        </div>
        <BottomUpFadeAnimation>
          <p className="mt-4 text-center leading-4 font-semibold tracking-wide text-muted-foreground">
            Last updated: April 21, 2026
          </p>
        </BottomUpFadeAnimation>

        <BottomUpFadeAnimation>
          <div className="mt-20 space-y-16">
            {PrivacyPolicySections.map((section) => (
              <LegalSectionBlock key={section.title} title={section.title} description={section.description} />
            ))}
          </div>
        </BottomUpFadeAnimation>
      </main>
      <Footer />
    </div>
  )
}
