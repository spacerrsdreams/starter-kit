import "server-only"

import { getRequestConfig } from "next-intl/server"

import enMessages from "@/i18n/en.json"

export default getRequestConfig(async () => {
  return {
    locale: "en",
    messages: enMessages,
  }
})
