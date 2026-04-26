import "server-only"

import { PrismaClient } from "@/generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { ServerEnv } from "@/lib/env.server"

declare global {
  var prisma: PrismaClient | undefined
  var prismaAdapter: PrismaNeon | undefined
}

const adapter = new PrismaNeon({ connectionString: ServerEnv.DATABASE_URL })

export const prisma = new PrismaClient({ adapter })
