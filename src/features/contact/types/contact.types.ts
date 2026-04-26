export type ContactFormActionState = {
  status: "idle" | "success" | "error"
  message: string | null
}

export const initialContactFormActionState: ContactFormActionState = {
  status: "idle",
  message: null,
}
