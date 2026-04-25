import Link from "next/link"

import { WebRoutes } from "@/lib/web.routes"
import { Footer } from "@/components/footer/footer"
import { BlurWaveTextAnimation } from "@/components/motion/blur-wave-text.animation"
import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"
import { HeaderNavigationClient } from "@/components/navigation/header-navigation.client"
import { Button } from "@/components/ui/button"
import { TopGradient } from "@/components/ui/top-gradient"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl border-r border-l border-border/75">
        <div className="mx-auto max-w-5xl">
          <TopGradient />
          <HeaderNavigationClient />
          <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center text-center">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 h-48 w-48 animate-pulse rounded-full bg-accent-1/20 blur-3xl" />
              <div className="absolute right-1/4 bottom-1/4 h-56 w-56 animate-pulse rounded-full bg-accent-1/10 blur-3xl [animation-delay:450ms]" />
            </div>
            <BottomUpFadeAnimation>
              <h1 className="text-[220px] leading-none font-semibold tracking-tight text-black md:text-[280px]">
                4<span className="text-accent-1">0</span>4
              </h1>
            </BottomUpFadeAnimation>
            <BottomUpFadeAnimation delay={0.12}>
              <BlurWaveTextAnimation
                text="Sorry! Page not found"
                className="-mt-3 text-4xl font-bold text-foreground"
              />
            </BottomUpFadeAnimation>
            <BottomUpFadeAnimation delay={0.2}>
              <p className="mt-4 max-w-xl text-xl text-foreground">
                The page you are looking for does not exist, has moved, or may have been removed.
              </p>
            </BottomUpFadeAnimation>
            <BottomUpFadeAnimation delay={0.28}>
              <Button
                asChild
                className="mt-10 rounded-full bg-foreground px-8 py-6 font-bold hover:bg-foreground/90"
                featureStylesEnabled
              >
                <Link href={WebRoutes.root.path}>Go Back To Home</Link>
              </Button>
            </BottomUpFadeAnimation>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
