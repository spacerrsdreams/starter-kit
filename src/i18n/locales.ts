export const LOCALES = ["EN", "DE"] as const

export type Locale = (typeof LOCALES)[number]

export type LocaleOption = {
  value: Locale
  label: string
  flag: string
  country: string
}

export const LOCALE_OPTIONS: LocaleOption[] = [
  {
    value: "EN",
    label: "English",
    flag: "🇺🇸",
    country: "United States",
  },
  {
    value: "DE",
    label: "German",
    flag: "🇩🇪",
    country: "Germany",
  },
]

export const DEFAULT_LOCALE: Locale = "EN"
