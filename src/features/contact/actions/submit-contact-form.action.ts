"use server"

import "server-only"

import { sendContactSubmissionEmail } from "@/features/emails/lib/emails.actions"
import { submitContactFormSchema } from "@/features/contact/schemas/contact-submission.schema"
import type { ContactFormActionState } from "@/features/contact/types/contact-form-action-state.types"

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

  await sendContactSubmissionEmail(parsed.data)

  return {
    status: "success",
    message: "Message sent successfully. We will get back to you soon.",
  }
}
