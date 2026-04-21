"use client"

import { motion, useScroll, useTransform } from "motion/react"
import Image from "next/image"
import { useRef } from "react"

import { SiteConfig } from "@/lib/site.config"

export function HeroDashboardPreviewClient() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 92%", "end 42%"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1.2])

  return (
    <div ref={targetRef} className="mx-auto w-full max-w-5xl">
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
  )
}
