"use client"

import Lenis from "lenis"
import type { ReactNode } from "react"
import { useEffect } from "react"

type SmoothScrollProviderProps = {
  children: ReactNode
}

function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.1,
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      prevent: (node) => {
        if (!(node instanceof HTMLElement)) {
          return false
        }

        if (node.closest("[data-lenis-prevent]")) {
          return true
        }

        let current: HTMLElement | null = node
        while (current && current !== document.body) {
          const style = window.getComputedStyle(current)
          const hasScrollableY = /(auto|scroll|overlay)/.test(style.overflowY)
          if (hasScrollableY && current.scrollHeight > current.clientHeight) {
            return true
          }
          current = current.parentElement
        }

        return false
      },
    })

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

export { SmoothScrollProvider }
