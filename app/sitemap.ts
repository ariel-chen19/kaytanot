import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kaytanot.co.il";
  const supabase = createClient();

  const { data: camps } = await supabase
    .from("camps")
    .select("slug, created_at")
    .eq("is_active", true);

  const campUrls: MetadataRoute.Sitemap = (camps ?? []).map((c) => ({
    url:          `${siteUrl}/kaytana/${c.slug}`,
    lastModified: new Date(c.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: siteUrl,                        lastModified: new Date(), changeFrequency: "daily",  priority: 1.0 },
    { url: `${siteUrl}/search`,            lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
    { url: `${siteUrl}/coming-soon`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
    ...campUrls,
  ];
}
