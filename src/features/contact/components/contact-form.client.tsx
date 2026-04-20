"use client"

import { useActionState, useEffect, useRef } from "react"

import { submitContactFormAction } from "@/features/contact/actions/submit-contact-form.action"
import { initialContactFormActionState } from "@/features/contact/types/contact-form-action-state.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ContactFormClient() {
  const [state, formAction, pending] = useActionState(submitContactFormAction, initialContactFormActionState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset()
    }
  }, [state.status])

  return (
    <form ref={formRef} className="space-y-5" action={formAction}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name<span className="text-destructive">*</span>
          </Label>
          <Input id="firstName" name="firstName" required placeholder="Robert" className="h-11 rounded-xl px-4" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" placeholder="Fox" className="h-11 rounded-xl px-4" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email<span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          required
          type="email"
          placeholder="demo@mail.com"
          className="h-11 rounded-xl px-4"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="Sales" className="h-11 rounded-xl px-4" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Message<span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Message"
          className="min-h-36 resize-none rounded-xl px-4 py-3"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        featureStylesEnabled
        className="h-11 w-full rounded-full text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Sending..." : "Send Message"}
      </Button>

      {state.message ? (
        <p
          aria-live="polite"
          className={state.status === "error" ? "text-sm text-destructive" : "text-sm text-muted-foreground"}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  )
}
