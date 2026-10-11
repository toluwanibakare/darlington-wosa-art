import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"],
    },
    sitemap: "https://www.darlingtonwosa.art/sitemap.xml",
  };
}
