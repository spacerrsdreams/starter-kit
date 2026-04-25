import dynamic from "next/dynamic"

export { FooterLinksSection } from "@/components/footer/footer-content"

export const Footer = dynamic(() =>
  import("@/components/footer/footer-content").then((module) => ({
    default: module.Footer,
  }))
)
