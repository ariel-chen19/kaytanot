import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kaytanot.co.il";
  return {
    rules: {
      userAgent: "*",
      allow: ["/kaytana/mitgalgalim"],
      disallow: ["/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
