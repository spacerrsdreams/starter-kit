import { SiteConfig } from "@/lib/site.config"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl space-y-4 px-6 py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Contact</h1>
        <p className="text-muted-foreground">
          Need help with {SiteConfig.name}? Reach out anytime and we will get back to you as soon as possible.
        </p>
      </main>
      <Footer />
    </div>
  )
}
