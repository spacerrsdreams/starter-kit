"use client"

import { motion, useScroll, useTransform } from "motion/react"
import Image from "next/image"
import { useRef } from "react"

import { SiteConfig } from "@/lib/site.config"
import { BottomUpFadeAnimation } from "@/components/motion/bottom-up-fade.animation"
import { useIsMobile } from "@/hooks/use-mobile"

export function DashboardPreviewClient() {
  const targetRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 92%", "end 89%"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.88, 1] : [0.92, 1.08])

  return (
    <BottomUpFadeAnimation>
      <div
        ref={targetRef}
        className="relative mx-auto mt-20 w-full max-w-5xl overflow-x-clip px-2 lg:overflow-x-visible"
      >
        <motion.div style={{ scale }} className="origin-top">
          <div className="mx-auto w-full rounded-sm bg-secondary/90 p-2 sm:rounded-md sm:p-4 lg:backdrop-blur-xl">
            <div className="relative aspect-849/510 overflow-hidden rounded-sm border sm:rounded-md">
              <Image
                src="/assets/dashboard.webp"
                alt={`${SiteConfig.name} Dashboard preview`}
                fill
                sizes="(min-width: 1024px) 960px, 96vw"
                priority
                className="object-cover object-center"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </BottomUpFadeAnimation>
  )
}
