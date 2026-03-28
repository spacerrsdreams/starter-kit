import "server-only"

const WINDOW_MS = 60 * 60 * 1000
const LIMIT = 3

const verificationEmailAttempts = new Map<string, number[]>()

export async function checkVerificationEmailRatelimit(userId: string): Promise<{
  success: boolean
  retryAfterSeconds: number
  remaining: number
}> {
  const now = Date.now()
  const cutoff = now - WINDOW_MS
  const attempts = verificationEmailAttempts.get(userId) ?? []
  const activeAttempts = attempts.filter((timestamp) => timestamp > cutoff)

  if (activeAttempts.length >= LIMIT) {
    const oldest = activeAttempts[0] ?? now
    const retryAfterSeconds = Math.max(0, Math.ceil((oldest + WINDOW_MS - now) / 1000))

    verificationEmailAttempts.set(userId, activeAttempts)

    return {
      success: false,
      retryAfterSeconds,
      remaining: 0,
    }
  }

  const updatedAttempts = [...activeAttempts, now]
  verificationEmailAttempts.set(userId, updatedAttempts)

  return {
    success: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, LIMIT - updatedAttempts.length),
  }
}
