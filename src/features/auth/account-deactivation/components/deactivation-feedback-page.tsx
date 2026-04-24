import { submitDeactivationFeedbackAction } from "@/features/auth/account-deactivation/actions/submit-deactivation-feedback.action"
import {
  deactivationFeedbackCategories,
  deactivationFeedbackCategoryLabels,
} from "@/features/auth/account-deactivation/constants/deactivation-feedback-category.constants"
import type { DeactivationFeedbackPageProps } from "@/features/auth/account-deactivation/types/deactivation-feedback-page.types"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { GlassPanel } from "@/components/ui/glass-panel"
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
    <GlassPanel className="w-full max-w-xl" innerClassName="p-6 sm:p-8">
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-[-1px] text-foreground">{texts.title}</h1>
        <p className="text-sm text-muted-foreground">{texts.description}</p>
      </div>
      <form action={submitDeactivationFeedbackAction} className="space-y-5">
        <FieldGroup>
          <Field className="space-y-2">
            <FieldLabel htmlFor="category">{texts.categoryLabel}</FieldLabel>
            <select
              id="category"
              name="category"
              required
              defaultValue=""
              className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-xs transition outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
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
          <Field className="space-y-2">
            <FieldLabel htmlFor="reason">{texts.reasonLabel}</FieldLabel>
            <Textarea
              id="reason"
              name="reason"
              minLength={10}
              maxLength={2000}
              required
              placeholder={texts.reasonPlaceholder}
              className="min-h-36 resize-none rounded-xl px-4 py-3"
            />
            <FieldDescription>{texts.reasonHint}</FieldDescription>
          </Field>
          {hasError ? <p className="text-sm text-destructive">{texts.validationError}</p> : null}
          <Button
            type="submit"
            featureStylesEnabled
            className="h-11 w-full rounded-full text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70"
          >
            {texts.submit}
          </Button>
        </FieldGroup>
      </form>
    </GlassPanel>
  )
}
