"use server"

import "server-only"

import { isAPIError } from "better-auth/api"
import type { Route } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { ApiRoutes } from "@/lib/api.routes"
import { auth } from "@/lib/auth/auth"
import type { AuthEmbeddedOnlySuccess, AuthRedirectSuccess } from "@/lib/auth/auth-action.types"
import { getAuthApiErrorCode } from "@/lib/auth/auth-utils"
import { reactivateDeactivatedAccountWithDetail } from "@/lib/auth/auth.repository"
import {
  callbackUrlSchema,
  ReactivateAndSignInActionInput,
  reactivateAndSignInActionInputSchema,
  RequestPasswordResetActionInput,
  requestPasswordResetSchema,
  ResetPasswordActionInput,
  resetPasswordActionInputSchema,
  signInWithEmailAndPasswordActionInputSchema,
  signUpWithEmailAndPasswordActionInputSchema,
  type SignInWithEmailAndPasswordActionInput,
  type SignUpWithEmailAndPasswordActionInput,
} from "@/lib/auth/auth.schema"
import { WebRoutes } from "@/lib/web.routes"

export type SocialSignInResult = { ok: false }

export async function signInWithGoogleAction(callbackURL: string): Promise<SocialSignInResult> {
  const safe = callbackUrlSchema.safeParse(callbackURL)

  if (!safe.success) {
    return { ok: false }
  }

  let result: { redirect: boolean; url?: string }

  try {
    result = await auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: safe.data,
      },
      headers: await headers(),
    })
  } catch (error: unknown) {
    if (isAPIError(error)) {
      return { ok: false }
    }

    return { ok: false }
  }

  if (result.redirect && result.url) {
    redirect(result.url as Route)
  }

  return { ok: false }
}

export async function signInWithEmailAndPasswordAction(input: SignInWithEmailAndPasswordActionInput) {
  const parsed = signInWithEmailAndPasswordActionInputSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, code: "INVALID_EMAIL_OR_PASSWORD" }
  }

  const { email, password, callbackURL, embedded } = parsed.data

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL,
      },
      headers: await headers(),
    })
  } catch (error: unknown) {
    return { ok: false, code: getAuthApiErrorCode(error) }
  }

  if (embedded) {
    return { ok: true } satisfies AuthEmbeddedOnlySuccess
  }

  return { ok: true, redirectTo: WebRoutes.root.withBaseUrl() } satisfies AuthRedirectSuccess
}

export async function reactivateAndSignInAction(input: ReactivateAndSignInActionInput) {
  const parsed = reactivateAndSignInActionInputSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, code: "INVALID_EMAIL_OR_PASSWORD" }
  }

  const { email, password, callbackURL, embedded } = parsed.data

  const reactivateOutcome = await reactivateDeactivatedAccountWithDetail(email, password)

  if (reactivateOutcome !== "success") {
    return { ok: false, code: "INVALID_EMAIL_OR_PASSWORD" }
  }

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL,
      },
      headers: await headers(),
    })
  } catch (error: unknown) {
    return { ok: false, code: getAuthApiErrorCode(error) }
  }

  if (embedded) {
    return { ok: true } satisfies AuthEmbeddedOnlySuccess
  }

  return { ok: true, redirectTo: WebRoutes.root.withBaseUrl() } satisfies AuthRedirectSuccess
}

export async function signUpWithEmailAndPasswordAction(input: SignUpWithEmailAndPasswordActionInput) {
  const parsed = signUpWithEmailAndPasswordActionInputSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, code: "INVALID_EMAIL_OR_PASSWORD" }
  }

  const { email, password, embedded } = parsed.data

  try {
    await auth.api.signUpEmail({
      body: {
        name: "User",
        email,
        password,
        callbackURL: ApiRoutes.authSignedIn,
      },
      headers: await headers(),
    })
  } catch (error: unknown) {
    return { ok: false, code: getAuthApiErrorCode(error) }
  }

  if (embedded) {
    return { ok: true } satisfies AuthEmbeddedOnlySuccess
  }

  return {
    ok: true,
    redirectTo: WebRoutes.root.withBaseUrl(),
  } satisfies AuthRedirectSuccess
}

export async function resetPasswordTokenAction(input: ResetPasswordActionInput) {
  const parsed = resetPasswordActionInputSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, code: "INVALID_TOKEN" }
  }

  const { newPassword, token } = parsed.data

  try {
    await auth.api.resetPassword({
      body: {
        newPassword,
        token,
      },
      headers: await headers(),
    })
  } catch (error: unknown) {
    return { ok: false, code: getAuthApiErrorCode(error) }
  }

  return {
    ok: true,
    redirectTo: WebRoutes.signIn.withBaseUrl(),
  } satisfies AuthRedirectSuccess
}

export async function requestPasswordResetAction(input: RequestPasswordResetActionInput) {
  const parsed = requestPasswordResetSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, code: "INVALID_EMAIL" }
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: parsed.data.email,
        redirectTo: WebRoutes.resetPassword.withBaseUrl(),
      },
      headers: await headers(),
    })
  } catch (error: unknown) {
    return { ok: false, code: getAuthApiErrorCode(error) }
  }

  return { ok: true }
}
