import type { ReactNode } from "react"

export type SendMailOptions = {
  to: string
  subject: string
  text?: string
  react: ReactNode
}
