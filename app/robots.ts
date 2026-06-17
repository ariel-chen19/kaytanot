import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://www.kaytanot.co.il";
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/kaytana/mitgalgalim", "/about", "/benefits", "/blog", "/faq", "/terms", "/privacy"],
      disallow: ["/dashboard", "/auth", "/api", "/publish"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
