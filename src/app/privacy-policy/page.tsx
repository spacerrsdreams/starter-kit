import { SiteConfig } from "@/lib/site.config"

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 p-6 text-sm leading-relaxed">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">
          This policy describes how {SiteConfig.name} handles your information. By creating an account, you agree to
          this policy together with our Terms of Service.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Email communications</h2>
        <p>
          When you sign up, you agree that we may send you emails in the following categories. These preferences match
          the defaults for new accounts; you can change them anytime in your account settings.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">Service and product messages.</span> Receive product reminders
            and service updates.
          </li>
          <li>
            <span className="font-medium text-foreground">Marketing messages.</span> Receive promotions and feature
            announcements.
          </li>
        </ul>
      </section>
    </main>
  )
}
