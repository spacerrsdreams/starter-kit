import { cva } from "class-variance-authority"
import type { ComponentType, SVGProps } from "react"

import { cn } from "@/lib/utils"

import { AnimatedSvg } from "./animated-svg.animation"

interface ChipProps {
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  className?: string
  variant?: "light" | "dark"
  size?: "sm" | "default"
}

const ChipVariants = cva("inline-flex items-center gap-3 rounded-full bg-background text-sm font-medium", {
  variants: {
    variant: {
      light: "border border-border/70 bg-background text-foreground [&_svg]:text-foreground",
      dark: "bg-[rgb(24,24,24)] text-white [&_svg]:text-white",
    },
    sizes: {
      sm: "px-3 py-1.5 [&_svg]:size-3.5",
      default: "px-4 py-2.5 [&_svg]:size-5",
    },
  },
  defaultVariants: {
    variant: "light",
  },
})

const ShadowVariants: Record<NonNullable<ChipProps["variant"]>, string> = {
  light: "rgba(0, 0, 0, 0.1) 0px 4px 12px 0px",
  dark: "rgba(0, 0, 0, 0.24) 0px 4px 16px 0px, rgba(255, 255, 255, 0.06) 0px 2px 4px 0px inset",
}

export function Chip({ Icon, title, className, variant = "light", size = "default" }: ChipProps) {
  return (
    <div
      className={cn(ChipVariants({ variant, sizes: size }), className)}
      style={{
        boxShadow: ShadowVariants[variant],
      }}
    >
      <AnimatedSvg>
        <Icon />
      </AnimatedSvg>
      {title}
    </div>
  )
}
