import { SiteConfig } from "@/lib/site.config"
import { Footer } from "@/components/footer"
import { HeaderNavigationClient } from "@/components/header-navigation.client"
import { TopGradient } from "@/components/top-gradient"
import { BlurWaveTextAnimation } from "@/components/ui/blur-wave-text.animation"
import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"

const termsOfService = [
  {
    title: `Terms & Conditions for Using ${SiteConfig.name}`,
    description: `Welcome to ${SiteConfig.name}! These Terms & Conditions govern your use of our CRM Management SaaS platform and associated services. By accessing or using ${SiteConfig.name}, you agree to be bound by the following terms. Please read them carefully.`,
  },
  {
    title: "Acceptance of Terms",
    description: `By registering or using ${SiteConfig.name} you accept these Terms & Conditions in full. If you do not agree with any part of these terms, you are prohibited from using our services.`,
  },
  {
    title: "User Responsibilities",
    description: `As a ${SiteConfig.name} user, you are responsible for maintaining the confidentiality of your account credentials and ensuring all activities under your account comply with these terms. Misuse, unauthorized access, or malicious activities may result in immediate account suspension or termination.`,
  },
  {
    title: "Use of Services",
    description: `${SiteConfig.name} is designed to improve CRM management and customer engagement. You agree to use the platform solely for lawful purposes, in accordance with its intended functionality, and not to interfere with or disrupt the service or servers.`,
  },
  {
    title: "Subscription and Payment",
    description: `${SiteConfig.name} offers subscription-based plans. By subscribing, you agree to pay all associated fees as outlined in your plan. Non-payment may result in suspension or termination of your account.`,
  },
  {
    title: "Data Privacy",
    description: `We prioritize your data privacy and security. By using ${SiteConfig.name}, you consent to our collection, use, and storage of data in accordance with our Privacy Policy. You retain ownership of your data, but grant ${SiteConfig.name} a license to process it as required for delivering the service.`,
  },
  {
    title: "Intellectual Property",
    description: `All intellectual property rights in ${SiteConfig.name}, including software, branding, and content, belong to ${SiteConfig.name} or its licensors. You are granted a limited license to use the platform for its intended purpose but may not modify, distribute, or reproduce any part of it without permission.`,
  },
  {
    title: "Limitation of Liability",
    description: `${SiteConfig.name} is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages resulting from the use of the platform, to the extent permitted by law.`,
  },
  {
    title: "Termination of Service",
    description: `We reserve the right to terminate or suspend your access to ${SiteConfig.name} at our discretion, including for violations of these terms or non-payment of fees.`,
  },
  {
    title: "Modifications to Terms",
    description: `${SiteConfig.name} reserves the right to update or modify these Terms & Conditions at any time. Continued use of the platform after changes indicates acceptance of the updated terms.`,
  },
  {
    title: "Governing Law",
    description: `These Terms & Conditions are governed by and construed in accordance with the laws of the jurisdiction where ${SiteConfig.name} operates. Any disputes will be resolved exclusively in the courts of that jurisdiction.`,
  },
  {
    title: "Acknowledgement",
    description: `By using ${SiteConfig.name}, you acknowledge that you have read, understood, and agree to abide by these Terms & Conditions. If you have any questions, feel free to contact our support team for assistance.`,
  },
]

function LegalTermsSectionBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold tracking-[-1px] text-foreground">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-background">
      <TopGradient />
      <HeaderNavigationClient />
      <main className="mx-auto w-full max-w-5xl px-4 py-30 sm:px-6 md:py-45">
        <div className="flex items-center justify-center">
          <BlurWaveTextAnimation
            className="text-3xl font-semibold tracking-[-3px] text-foreground sm:text-6xl"
            text="Terms & Conditions"
          />
        </div>
        <BottomUpFadeAnimation>
          <p className="mt-4 text-center leading-4 font-semibold tracking-wide text-muted-foreground">
            Last updated: April 6, 2026
          </p>
        </BottomUpFadeAnimation>

        <div className="mt-20 space-y-16">
          {termsOfService.map((section) => (
            <LegalTermsSectionBlock key={section.title} title={section.title} description={section.description} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
