"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext("2d")

    if (!ctx) return

    let animationFrameId: number | undefined
    let particles: Particle[] = []
    let lastFrameMs = 0

    // Performance controls:
    // - Cap particle count (current rendering is O(n^2) due to pairwise link drawing).
    // - Throttle animation work to ~30fps.
    // - Pause when tab is hidden.
    const MAX_PARTICLES = 500
    const MIN_FRAME_INTERVAL_MS = 61

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      const rawParticleCount = Math.floor((canvas.width * canvas.height) / 15000)
      const particleCount = Math.min(rawParticleCount, MAX_PARTICLES)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.2,
        })
      }
    }

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fill()
      })

      // If we hit the particle cap, drawing links becomes very expensive.
      // Reduce link distance so we draw fewer lines.
      const linkDistance = particles.length >= MAX_PARTICLES ? 75 : 100

      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < linkDistance) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / linkDistance)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
    }

    const animate = (time: number) => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }

      if (time - lastFrameMs >= MIN_FRAME_INTERVAL_MS) {
        lastFrameMs = time
        drawFrame()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createParticles()
    if (prefersReducedMotion) {
      // Render a single frame and stop to respect reduced motion preference.
      drawFrame()
      return
    }

    animate(0)

    const onResize = () => {
      resizeCanvas()
      createParticles()
    }

    window.addEventListener("resize", onResize)

    return () => {
      if (typeof animationFrameId === "number") cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />
}
