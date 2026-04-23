import { SiteConfig } from "@/lib/site.config"

export const TERMS_OF_SERVICE_SECTIONS = [
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
] as const

export const PRIVACY_POLICY_SECTIONS = [
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
] as const
