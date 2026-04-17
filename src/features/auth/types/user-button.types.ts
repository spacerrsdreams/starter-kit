import type { User } from "better-auth"

export type UserButtonProps = {
  user: User
  isAdmin?: boolean
  isImpersonating?: boolean
}
