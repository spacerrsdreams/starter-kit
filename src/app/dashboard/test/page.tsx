import { WebRoutes } from "@/lib/web.routes"
import { WaveGlowButton } from "@/features/test/components/wave-glow-button"

export default function TestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-6 py-16 dark:bg-black">
      <WaveGlowButton href={WebRoutes.pricing.path} label="Get Started" />
    </main>
  )
}
