import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://example.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/articles"],
      disallow: ["/library", "/auth", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
