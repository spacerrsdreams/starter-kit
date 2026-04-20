"use server"

import "server-only"

import type { ContactFormActionState } from "@/features/contact/types/contact-form-action-state.types"
import { createContactSubmission } from "@/features/contact/repositories/contact-submission.repository"
import { submitContactFormSchema } from "@/features/contact/schemas/contact-submission.schema"

export async function submitContactFormAction(
  _previousState: ContactFormActionState,
  formData: FormData
): Promise<ContactFormActionState> {
  const parsed = submitContactFormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check your details and try again.",
    }
  }

  await createContactSubmission(parsed.data)

  return {
    status: "success",
    message: "Message sent successfully. We will get back to you soon.",
  }
}
