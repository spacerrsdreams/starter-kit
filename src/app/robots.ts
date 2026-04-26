import type { MetadataRoute } from "next"

import { ServerEnv } from "@/lib/env.server"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/ai/", "/dashboard/admin/", "/admin/"],
      },
    ],
    sitemap: `${ServerEnv.NEXT_PUBLIC_DOMAIN}/sitemap.xml`,
  }
}
