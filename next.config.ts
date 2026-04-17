import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
  typedRoutes: true,
  cacheComponents: true,
  allowedDevOrigins: ["sole-capital-typically.ngrok-free.app"],
}

export default nextConfig
