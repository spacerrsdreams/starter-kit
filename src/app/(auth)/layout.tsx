type AuthLayoutProps = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-dvh overflow-y-auto md:h-dvh md:pb-0">
      {/* <ParticleBackground /> */}
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col" data-auth-content>
        {children}
      </div>
    </div>
  )
}
