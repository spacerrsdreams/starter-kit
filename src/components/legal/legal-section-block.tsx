type LegalSectionBlockProps = {
  title: string
  description: string
}

export function LegalSectionBlock({ title, description }: LegalSectionBlockProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold tracking-[-1px] text-foreground">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
