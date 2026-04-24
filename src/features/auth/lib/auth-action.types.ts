export type AuthActionFailure = { ok: false; code: string }

/** After email/password sign-in when cookies are set; client should `refetch()` then `router.push(redirectTo)`. */
export type AuthRedirectSuccess = { ok: true; redirectTo: string }

/** Modal / embedded flows: no navigation; client should `refetch()` then run `onSuccess`. */
export type AuthEmbeddedOnlySuccess = { ok: true }
