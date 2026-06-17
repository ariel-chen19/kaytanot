export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import CampCard from "@/components/CampCard";
import Link from "next/link";
import { SearchX, MapPin, Users, Activity, SlidersHorizontal } from "lucide-react";

interface SearchPageProps {
  searchParams: { city?: string; age?: string; category?: string };
}

const CITIES = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "רחובות", "פתח תקווה", "ראשון לציון"];
const AGES   = [{ label: "3-5",  value: "4"  },
                { label: "6-8",  value: "7"  },
                { label: "9-11", value: "10" },
                { label: "12-14",value: "13" },
                { label: "15-18",value: "16" }];
const CATEGORIES = ["ספורט", "שחייה", "ריקוד", "אמנות", "טכנולוגיה", "כדורגל", "טניס"];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = createClient();
  const { city, age, category } = searchParams;

  let query = supabase
    .from("camps")
    .select("id, name, slug, description, city, age_min, age_max, image_url, price_basic")
    .eq("is_active", true);

  if (city)     query = query.eq("city", city);
  if (category) query = query.ilike("name", `%${category}%`);
  if (age) {
    const n = parseInt(age, 10);
    if (!isNaN(n)) query = query.lte("age_min", n).gte("age_max", n);
  }

  const { data: camps } = await query.order("created_at", { ascending: false });
  const hasFilters = !!(city || age || category);
  const count = camps?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* ── Header bar ── */}
      <div className="bg-[#003087] py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-1">
            {hasFilters ? "תוצאות חיפוש" : "כל הקייטנות"}
          </h1>
          <p className="text-blue-200 text-sm">
            {count > 0 ? `נמצאו ${count} קייטנות` : "לא נמצאו תוצאות"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Sidebar filters ── */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal className="w-4 h-4 text-[#003087]" />
                <h2 className="font-black text-[#003087] text-base">סינון</h2>
              </div>

              {/* City */}
              <div className="mb-5">
                <p className="text-xs font-bold text-[#003087] mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> עיר / אזור
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CITIES.map((c) => (
                    <Link
                      key={c}
                      href={`/search?${new URLSearchParams({ ...(age ? { age } : {}), ...(category ? { category } : {}), city: c }).toString()}`}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        city === c
                          ? "bg-[#003087] text-white border-[#003087]"
                          : "border-[#e0e8f0] text-gray-600 hover:border-[#003087] hover:text-[#003087]"
                      }`}
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div className="mb-5">
                <p className="text-xs font-bold text-[#003087] mb-2 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> גיל
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {AGES.map((a) => (
                    <Link
                      key={a.value}
                      href={`/search?${new URLSearchParams({ ...(city ? { city } : {}), ...(category ? { category } : {}), age: a.value }).toString()}`}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        age === a.value
                          ? "bg-[#003087] text-white border-[#003087]"
                          : "border-[#e0e8f0] text-gray-600 hover:border-[#003087] hover:text-[#003087]"
                      }`}
                    >
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-5">
                <p className="text-xs font-bold text-[#003087] mb-2 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> סוג קייטנה
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      href={`/search?${new URLSearchParams({ ...(city ? { city } : {}), ...(age ? { age } : {}), category: cat }).toString()}`}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        category === cat
                          ? "bg-[#F5C400] text-[#003087] border-[#F5C400] font-bold"
                          : "border-[#e0e8f0] text-gray-600 hover:border-[#F5C400] hover:text-[#003087]"
                      }`}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {hasFilters && (
                <Link
                  href="/search"
                  className="block w-full text-center text-sm text-[#003087] hover:text-[#F5C400] underline underline-offset-2 transition-colors mt-2"
                >
                  נקה סינון
                </Link>
              )}
            </div>
          </aside>

          {/* ── Results ── */}
          <main className="lg:col-span-3">
            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {city && (
                  <span className="inline-flex items-center gap-1.5 bg-[#003087] text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    <MapPin className="w-3 h-3" />{city}
                  </span>
                )}
                {age && (
                  <span className="inline-flex items-center gap-1.5 bg-[#003087] text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    <Users className="w-3 h-3" />גיל {age}
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center gap-1.5 bg-[#F5C400] text-[#003087] text-xs font-bold px-3 py-1.5 rounded-full">
                    <Activity className="w-3 h-3" />{category}
                  </span>
                )}
              </div>
            )}

            {camps && camps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {camps.map((camp) => (
                  <CampCard key={camp.id} camp={camp} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#e0e8f0] text-center">
                <div className="w-16 h-16 rounded-full bg-[#F5F7FA] flex items-center justify-center mb-4">
                  <SearchX className="w-8 h-8 text-[#003087]/30" />
                </div>
                <h2 className="text-xl font-black text-[#003087] mb-2">לא נמצאו קייטנות</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                  נסו לחפש עם פחות סינונים, או עיינו בכל הקייטנות שלנו.
                </p>
                <Link
                  href="/search"
                  className="bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black px-7 py-3 rounded-full transition-colors text-sm"
                >
                  הצג את כל הקייטנות
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
