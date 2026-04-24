import { Footer } from "@/components/footer"
import { HeaderNavigationClient } from "@/components/navigation/header-navigation.client"
import { TopGradient } from "@/components/ui/top-gradient"

type AuthLayoutProps = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="bg-background">
      <TopGradient />
      <HeaderNavigationClient />
      <div className="flex min-h-screen items-center justify-center">{children}</div>
      <Footer />
    </main>
  )
}
