export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import CampCard from "@/components/CampCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

interface SearchPageProps {
  searchParams: { city?: string; age?: string; category?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = createClient();
  const { city, age } = searchParams;

  let query = supabase
    .from("camps")
    .select("id, name, slug, description, city, age_min, age_max, image_url, price_basic")
    .eq("is_active", true);

  if (city) query = query.eq("city", city);

  if (age) {
    const ageNum = parseInt(age, 10);
    if (!isNaN(ageNum)) {
      query = query.lte("age_min", ageNum).gte("age_max", ageNum);
    }
  }

  const { data: camps } = await query.order("created_at", { ascending: false });

  const hasFilters = !!city || !!age;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1A1A2E] mb-2">
          {hasFilters ? "תוצאות חיפוש" : "כל הקייטנות"}
        </h1>
        {hasFilters && (
          <div className="flex flex-wrap gap-2 items-center text-muted-foreground text-sm">
            {city && <span className="bg-blue-100 text-[#1B4F72] px-3 py-1 rounded-full font-medium">{city}</span>}
            {age && <span className="bg-orange-100 text-[#FF6B35] px-3 py-1 rounded-full font-medium">גיל {age}</span>}
            <Link href="/search" className="underline hover:no-underline">נקה סינון</Link>
          </div>
        )}
      </div>

      {camps && camps.length > 0 ? (
        <>
          <p className="text-muted-foreground mb-6">{camps.length} קייטנות נמצאו</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {camps.map((camp) => (
              <CampCard key={camp.id} camp={camp} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-border">
          <SearchX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">לא נמצאו קייטנות</h2>
          <p className="text-muted-foreground mb-6">
            נסו לחפש עם פחות סינונים, או עיינו בכל הקייטנות שלנו.
          </p>
          <Link href="/search">
            <Button className="bg-[#FF6B35] hover:bg-[#e55a27] text-white">הצג את כל הקייטנות</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
