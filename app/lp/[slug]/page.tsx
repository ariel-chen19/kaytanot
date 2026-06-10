import type { Metadata } from "next";
import KaytanaPage, { generateMetadata as generateKaytanaMetadata } from "@/app/kaytana/[slug]/page";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const metadata = await generateKaytanaMetadata({ params });

  return {
    ...metadata,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default KaytanaPage;
