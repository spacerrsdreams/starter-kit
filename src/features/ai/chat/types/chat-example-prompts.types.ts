export type ChatExamplePromptsProps = {
  disabled?: boolean
  prompts?: readonly string[]
  layout?: "default" | "single-column"
  onSelect: (text: string) => void
}
