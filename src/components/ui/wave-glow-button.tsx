"use client"

import { motion } from "motion/react"
import { Route } from "next"
import Link from "next/link"

import { authClient } from "@/lib/auth/auth-client"
import { useAuthRequiredModal } from "@/features/auth/components/auth-required-modal/auth-required-modal-context"

type WaveGlowButtonProps = {
  href: string
  label: string
  requireAuth?: boolean
  authenticatedHref?: string
}

const waveGradient =
  "linear-gradient(90deg, rgb(33, 204, 238) 0%, rgb(20, 112, 239) 33.2763%, rgb(105, 39, 218) 68.4697%, rgb(242, 61, 148) 100%)"

export function WaveGlowButton({ href, label, requireAuth = false, authenticatedHref }: WaveGlowButtonProps) {
  const { data: session } = authClient.useSession()
  const { openAuthModal } = useAuthRequiredModal()
  const targetHref = (requireAuth && session?.user ? (authenticatedHref ?? href) : href) as Route

  const slideTransition = {
    type: "tween" as const,
    duration: 2.85,
    ease: [0.22, 1, 0.36, 1] as const,
  }
  const ctaLineClass = "flex h-5 min-h-5 w-full shrink-0 items-center justify-center whitespace-nowrap leading-none"

  return (
    <Link
      href={targetHref}
      onClick={(event) => {
        if (!requireAuth) return

        event.preventDefault()

        if (session?.user) {
          window.location.href = (authenticatedHref ?? href) as Route
        } else {
          openAuthModal()
        }
      }}
      className="group relative inline-flex flex-col items-center justify-center gap-2 overflow-visible rounded-[100px] bg-[linear-gradient(90deg,rgb(33,204,238)_0%,rgb(20,112,239)_33.2763%,rgb(105,39,218)_68.4697%,rgb(242,61,148)_100%)] pb-px"
    >
      <span aria-hidden className="pointer-events-none absolute right-0 -bottom-2 left-0">
        <motion.span
          className="mx-auto block h-6 w-[90%] rounded-full opacity-100 blur-md"
          style={{ background: waveGradient }}
          animate={{
            x: ["-10%", "10%", "-10%"],
            opacity: [0.62, 0.72, 0.62],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </span>

      <motion.span
        className="relative z-10 inline-flex min-h-14 items-center justify-center overflow-hidden rounded-[100px] px-8 text-sm font-semibold tracking-[-0.6px] whitespace-nowrap text-white transition-transform duration-200 group-hover:scale-[1.01]"
        style={{ background: "linear-gradient(rgb(255, 255, 255) -51%, rgb(16, 2, 2) 18%, rgb(16, 2, 2) 132%)" }}
        initial="rest"
        animate="rest"
        whileHover="hover"
        transition={slideTransition}
      >
        <span className="sr-only">{label}</span>
        <span aria-hidden className="mx-auto block h-5 min-h-5 w-full min-w-0 overflow-hidden">
          <motion.span
            className="flex w-full flex-col"
            variants={{
              rest: { y: 0 },
              hover: { y: "-1.25rem" },
            }}
            transition={slideTransition}
          >
            <span className={ctaLineClass}>{label}</span>
            <span className={ctaLineClass}>{label}</span>
          </motion.span>
        </span>
      </motion.span>
    </Link>
  )
}
