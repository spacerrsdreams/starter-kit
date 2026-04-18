import { submitDeactivationFeedbackAction } from "@/features/account-deactivation/actions/submit-deactivation-feedback.action"
import {
  deactivationFeedbackCategories,
  deactivationFeedbackCategoryLabels,
} from "@/features/account-deactivation/constants/deactivation-feedback-category.constants"
import type { DeactivationFeedbackPageProps } from "@/features/account-deactivation/types/deactivation-feedback-page.types"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

const texts = {
  title: "We are sorry to see you go",
  description: "Tell us why you are leaving. Your feedback helps us improve.",
  categoryLabel: "Main reason category",
  categoryPlaceholder: "Choose one category",
  reasonLabel: "Reason",
  reasonPlaceholder: "Share why you decided to deactivate your account...",
  reasonHint: "Minimum 10 characters.",
  submit: "Deactivate account",
  validationError: "Please choose a category and add a longer reason before submitting.",
}

export function DeactivationFeedbackPage({ hasError }: DeactivationFeedbackPageProps) {
  return (
    <div className="w-full max-w-xl rounded-2xl border bg-background p-6 shadow-sm">
      <div className="mb-5 space-y-1.5 text-center">
        <h1 className="flex items-center justify-center gap-2 text-xl font-medium">{texts.title}</h1>
        <p className="text-sm text-muted-foreground">{texts.description}</p>
      </div>
      <form action={submitDeactivationFeedbackAction} className="space-y-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="category">{texts.categoryLabel}</FieldLabel>
            <select
              id="category"
              name="category"
              required
              defaultValue=""
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="" disabled>
                {texts.categoryPlaceholder}
              </option>
              {deactivationFeedbackCategories.map((category) => (
                <option key={category} value={category}>
                  {deactivationFeedbackCategoryLabels[category]}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="reason">{texts.reasonLabel}</FieldLabel>
            <Textarea
              id="reason"
              name="reason"
              minLength={10}
              maxLength={2000}
              required
              placeholder={texts.reasonPlaceholder}
              className="min-h-32"
            />
            <FieldDescription>{texts.reasonHint}</FieldDescription>
          </Field>
          {hasError ? <p className="text-sm text-destructive">{texts.validationError}</p> : null}
          <Button type="submit" className="w-full">
            {texts.submit}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
