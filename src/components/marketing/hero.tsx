import { WebRoutes } from "@/lib/web.routes"
import { WaveGlowButton } from "@/features/test/components/wave-glow-button"
import { BlurWaveTextAnimation } from "@/components/ui/blur-wave-text.animation"
import { BottomUpFadeAnimation } from "@/components/ui/bottom-up-fade.animation"

export function Hero() {
  return (
    <BottomUpFadeAnimation>
      <section className="max-w-5-xl space-y-14 pt-30 sm:pt-45 md:space-y-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-border/70 px-5 py-2 text-sm font-semibold text-foreground/90">
            Join +1000 scaling business
          </span>
          <div className="mx-auto max-w-2xl">
            <BlurWaveTextAnimation
              text="The Smartest Way to Bring Best ROI for Sales"
              className="mt-8 justify-center text-3xl leading-[0.95] font-semibold tracking-[-3px] text-foreground md:text-6xl"
            />
          </div>
          <p className="mt-6 max-w-lg leading-relaxed tracking-tight text-foreground/90">
            The smarter way to manage sales starts with using tools that streamline every step of the process
          </p>
          <div className="mt-10">
            <WaveGlowButton href={WebRoutes.pricing.path} label="Get Started Now" />
          </div>
        </div>
      </section>
    </BottomUpFadeAnimation>
  )
}
