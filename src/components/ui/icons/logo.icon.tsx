import { cn } from "@/lib/utils"

export function LogoIcon({
  iconSize = 24,
  containerSize = 32,
  className,
}: React.ComponentProps<"svg"> & { iconSize?: number; containerSize?: number }) {
  return (
    <div
      className={cn("flex aspect-square items-center justify-center rounded-sm bg-accent-1 text-background", className)}
      style={{ height: containerSize, width: containerSize }}
    >
      <LogoSvg iconSize={iconSize} />
    </div>
  )
}

export const LogoSvg = ({
  iconSize = 24,
  className,
  ...props
}: React.ComponentProps<"svg"> & { iconSize?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style={{ width: iconSize, height: iconSize }}
      className={cn("text-background", className)}
      {...props}
    >
      <path
        d="M11.43 21.26c0-4.49-3.63-8.14-8.12-8.15a8.147 8.147 0 0 0 8.1-7.68h.03c.24 4.26 3.77 7.66 8.1 7.68-4.49.02-8.12 3.67-8.12 8.15Zm6.31-12.77c0-1.63-1.32-2.95-2.95-2.96 1.57 0 2.85-1.24 2.94-2.79h.01a2.964 2.964 0 0 0 2.94 2.79c-1.63 0-2.95 1.33-2.95 2.96Z"
        fill="#fff"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".3"
      />
    </svg>
  )
}
