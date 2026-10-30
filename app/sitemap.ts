import { MetadataRoute } from "next";
import { getSortedPostsData } from "@/lib/posts";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSortedPostsData().filter((p) => !p.noindex);
  const usedCategories = CATEGORIES.filter((c) => posts.some((p) => p.category === c.label));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/articles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...usedCategories.map((c) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/articles/${p.slug}`,
      lastModified: new Date(p.updated || p.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/login`, changeFrequency: "monthly", priority: 0.4 },
    ...["about", "editorial-policy", "sitemap", "contact", "privacy", "terms"].map((path) => ({
      url: `${SITE_URL}/${path}`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
