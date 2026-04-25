import type { ComponentType, SVGProps } from "react"

import { cn } from "@/lib/utils"
import { Chip } from "@/components/ui/chip"

type SectionHeadingProps = {
  chipIcon: ComponentType<SVGProps<SVGSVGElement>>
  chipText: string
  title: string
  description?: string
  chipVariant?: "light" | "dark"
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function SectionHeading({
  chipIcon,
  chipText,
  title,
  description,
  chipVariant = "light",
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <Chip Icon={chipIcon} title={chipText} variant={chipVariant} />
      <h2 className={cn("mt-6 text-3xl font-medium tracking-[-2.5px] text-foreground md:text-4xl", titleClassName)}>{title}</h2>
      {description ? <p className={cn("mt-4 text-foreground/80", descriptionClassName)}>{description}</p> : null}
    </div>
  )
}
