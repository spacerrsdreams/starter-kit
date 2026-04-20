import { WaveGlowButton } from "@/features/test/components/wave-glow-button"

export default function TestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-6 py-16 dark:bg-black">
      <WaveGlowButton href="/pricing" label="Get 14 Days Free Trial" />
    </main>
  )
}
