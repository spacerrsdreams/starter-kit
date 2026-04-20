"use client"

import { motion } from "motion/react"

export function TopGradient() {
  return (
    <div className="fixed top-0 left-0 z-40 h-2 w-full overflow-hidden">
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
    </div>
  )
}
