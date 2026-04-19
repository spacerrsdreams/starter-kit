import { cn } from "@/lib/utils"

export function LogoIcon({
  className,
  fill,
  strokeColor,
  ...props
}: React.ComponentProps<"svg"> & { fill?: string; strokeColor?: string }) {
  return (
    <svg
      id="uuid-f97c9fa6-b13b-4dbb-9251-9080020f2271"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={cn("size-4 shrink-0", className)}
      {...props}
    >
      <rect x="1.05" y="1.05" width="21.9" height="21.9" rx="10.5" ry="10.5" fill={fill ?? "var(--color-accent-1)"} />
      <path
        d="M14.11,18.29c-.08,0-.16,0-.25-.03-.29-.07-.51-.25-.6-.49,0,0,0,0,0,0l-3.37-9.76-1.14,3.31c-.25.73-1.09,1.25-2.03,1.25h-1.75c-.39,0-.7-.26-.7-.57s.31-.57.7-.57h1.75c.31,0,.59-.17.67-.42l1.65-4.78s0,0,0,0c.08-.24.31-.42.6-.49.23-.05.46-.03.67.06.21.09.36.24.42.43,0,0,0,0,0,0l3.37,9.76,1.14-3.31c.25-.74,1.09-1.25,2.03-1.25h1.75c.39,0,.7.26.7.57s-.31.57-.7.57h-1.75c-.32,0-.59.17-.68.42l-1.65,4.78s0,0,0,0c-.11.31-.46.51-.84.51Z"
        fill={strokeColor ?? "#fff"}
      />
    </svg>
  )
}
