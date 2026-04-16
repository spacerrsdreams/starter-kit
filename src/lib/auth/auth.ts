import "server-only"

import { betterAuth, User } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { headers } from "next/headers"

import { MIN_PASSWORD_LENGTH } from "@/lib/auth/auth.schema"
import { prisma } from "@/lib/prisma"
import { sendEmailVerificationEmail, sendResetPasswordEmail, sendWelcomeEmail } from "@/lib/resend/actions"
import { WebRoutes } from "@/lib/web.routes"

const SevenDays = 60 * 60 * 24 * 7

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [nextCookies()],
  baseURL: process.env.BETTER_AUTH_URL!,
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  resetPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  expiresIn: SevenDays,
  emailAndPassword: {
    requireEmailVerification: false,
    enabled: true,
    autoSignIn: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    sendResetPassword: async ({ user, url }: { user: User; url: string }) =>
      await sendResetPasswordEmail({
        to: user.email,
        userFirstname: user.name ?? "Dear User",
        resetPasswordLink: url,
      }),
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const callbackURL = encodeURIComponent(`${WebRoutes.root.withBaseUrl()}?emailVerified=1`)
      const verifyUrl = `${WebRoutes.root.withBaseUrl()}/api/auth/verify-email?token=${token}&callbackURL=${callbackURL}`

      await sendEmailVerificationEmail({
        to: user.email,
        subject: "Verify your email address",
        url: verifyUrl,
        firstName: user.name ?? "User",
      })
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await sendWelcomeEmail({
              to: user.email,
              firstName: user.name ?? undefined,
            })
          } catch (err) {
            console.error("Welcome email failed:", err)
          }
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          await prisma.user.update({
            where: { id: session.userId },
            data: { deactivatedAt: null },
          })
        },
      },
    },
  },
})

export async function getSessionUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}
