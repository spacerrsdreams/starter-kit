import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
  typedRoutes: true,
  cacheComponents: true,
  allowedDevOrigins: ["sole-capital-typically.ngrok-free.app"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
}

export default nextConfig
