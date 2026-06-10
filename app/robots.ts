import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://www.kaytanot.co.il";
  return {
    rules: {
      userAgent: "*",
      allow: ["/kaytana/mitgalgalim"],
      disallow: ["/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
