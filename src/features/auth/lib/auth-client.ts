import { passkeyClient } from "@better-auth/passkey/client"
import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import { ClientEnv } from "@/lib/env.client"

export const authClient = createAuthClient({
  baseURL: ClientEnv.NEXT_PUBLIC_DOMAIN,
  plugins: [adminClient(), passkeyClient()],
})
