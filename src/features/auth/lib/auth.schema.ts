import z from "zod"

export const MIN_PASSWORD_LENGTH = 5

export const MIN_PASSWORD_LENGTH_ERROR = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
export const passwordSchema = z.string().min(MIN_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH_ERROR)

export const signInWithEmailAndPasswordSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export const signUpWithEmailAndPasswordSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export const requestPasswordResetSchema = z.object({
  email: z.email("Invalid email address"),
})

export type RequestPasswordResetActionInput = z.infer<typeof requestPasswordResetSchema>

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export const signInWithEmailAndPasswordActionInputSchema = signInWithEmailAndPasswordSchema.extend({
  callbackURL: z.string().optional(),
  embedded: z.boolean().optional(),
})

export type SignInWithEmailAndPasswordActionInput = z.infer<typeof signInWithEmailAndPasswordActionInputSchema>

export const callbackUrlSchema = z.string().min(1)

export const reactivateAndSignInActionInputSchema = signInWithEmailAndPasswordSchema.extend({
  callbackURL: z.string().optional(),
  embedded: z.boolean().optional(),
})

export type ReactivateAndSignInActionInput = z.infer<typeof reactivateAndSignInActionInputSchema>

export const signUpWithEmailAndPasswordActionInputSchema = signUpWithEmailAndPasswordSchema.extend({
  callbackURL: z.string().optional(),
  embedded: z.boolean().optional(),
})

export type SignUpWithEmailAndPasswordActionInput = z.infer<typeof signUpWithEmailAndPasswordActionInputSchema>

export const resetPasswordActionInputSchema = resetPasswordSchema.extend({
  token: z.string().min(1),
})

export type ResetPasswordActionInput = z.infer<typeof resetPasswordActionInputSchema>
