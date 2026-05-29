export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

interface CampPageProps {
  params: { slug: string };
}

// Redirect legacy /camps/[slug] → /kaytana/[slug]
export default async function CampPage({ params }: CampPageProps) {
  const supabase = createClient();

  const { data: camp } = await supabase
    .from("camps")
    .select("slug, is_active")
    .eq("slug", params.slug)
    .single();

  if (!camp || !camp.is_active) notFound();

  redirect(`/kaytana/${params.slug}`);
}
