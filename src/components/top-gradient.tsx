"use client"

import { motion } from "motion/react"
import { useEffect, useState } from "react"

const TOP_GRADIENT_HIDE_OFFSET = 24

export function TopGradient() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let previousScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isScrollingDown = currentScrollY > previousScrollY
      const shouldHide = isScrollingDown && currentScrollY > TOP_GRADIENT_HIDE_OFFSET

      setIsVisible(!shouldHide)
      previousScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 z-40 h-2 w-full overflow-hidden"
      animate={{
        y: isVisible ? 0 : -12,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className="h-full w-full"
        style={{
          background: "linear-gradient(90deg, #21ccee 0%, #1470ef 33.1733%, #6927da 69.0133%, #f23d94 100%)",
          transformOrigin: "left",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: "circIn" }}
      />
    </motion.div>
  )
}
