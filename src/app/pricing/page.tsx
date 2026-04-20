import { Footer } from "@/components/footer"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl space-y-4 px-6 py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Pricing</h1>
        <p className="text-muted-foreground">
          Choose a plan that fits your workflow. Start simple and scale as your team grows.
        </p>
      </main>
      <Footer />
    </div>
  )
}
