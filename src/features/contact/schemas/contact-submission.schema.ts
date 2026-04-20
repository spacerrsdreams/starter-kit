import z from "zod"

export const submitContactFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(120, "First name is too long."),
  lastName: z
    .string()
    .trim()
    .max(120, "Last name is too long.")
    .transform((value) => (value.length > 0 ? value : null)),
  email: z.string().trim().email("Please enter a valid email address."),
  subject: z
    .string()
    .trim()
    .max(200, "Subject is too long.")
    .transform((value) => (value.length > 0 ? value : null)),
  message: z.string().trim().min(10, "Please share at least 10 characters.").max(3000, "Message is too long."),
})

export type SubmitContactFormInput = z.infer<typeof submitContactFormSchema>
