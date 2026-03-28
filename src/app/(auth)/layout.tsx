import { ParticleBackground } from "@/features/auth/components/particle-background"

type AuthLayoutProps = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-dvh overflow-y-auto md:h-dvh md:pb-0">
      <div
        className="relative flex min-h-dvh w-full flex-col md:min-h-full"
        style={{
          background: "linear-gradient(#779bc1 0%, #9abfda 58%, #cbdfec 100%)",
        }}
      >
        <ParticleBackground />
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col" data-auth-content>
          {children}
        </div>
      </div>
    </div>
  )
}
