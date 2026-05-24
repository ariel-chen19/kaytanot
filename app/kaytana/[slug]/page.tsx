export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Users, CheckCircle, Calendar, Clock, Building2 } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import FaqAccordion from "@/components/FaqAccordion";
import Link from "next/link";

interface Cycle {
  label: string;
  dates: string;
  days: string;
  hours: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface Camp {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  city: string;
  location: string | null;
  age_min: number;
  age_max: number;
  price_basic: number | null;
  price_advanced: number | null;
  image_url: string | null;
  activities: string[] | null;
  cycles: Cycle[] | null;
  cities: string[] | null;
  faq: FaqItem[] | null;
}

interface PageProps {
  params: { slug: string };
}

export default async function KaytanaPage({ params }: PageProps) {
  const supabase = createClient();

  const { data: camp } = await supabase
    .from("camps")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!camp) notFound();

  const c = camp as Camp;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* ══════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════ */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        {c.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.image_url}
            alt={c.name}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#003087] to-[#1a4aa8]" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#003087]/80 via-[#003087]/30 to-transparent" />

        {/* Hero content */}
        <div className="absolute bottom-0 right-0 left-0 p-6 md:p-10 container mx-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5" />
              {c.city}
            </span>
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
              <Users className="w-3.5 h-3.5" />
              גילאי {c.age_min}–{c.age_max}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            {c.name}
          </h1>
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black px-7 py-3 rounded-full transition-colors text-sm"
          >
            שלחו פנייה עכשיו
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN LAYOUT — content (2/3) + sidebar (1/3)
      ══════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Main content ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            {c.description && (
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e0e8f0]">
                <h2 className="text-xl font-black text-[#003087] mb-4">על הקייטנה</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">{c.description}</p>
              </section>
            )}

            {/* ── 2. Activities ── */}
            {c.activities && c.activities.length > 0 && (
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e0e8f0]">
                <h2 className="text-xl font-black text-[#003087] mb-5">פעילויות</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {c.activities.map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-[#F5F7FA] rounded-xl px-4 py-3 border border-[#e0e8f0]"
                    >
                      <CheckCircle className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                      <span className="text-sm font-medium text-[#003087]">{activity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── 3. Cycles ── */}
            {c.cycles && c.cycles.length > 0 && (
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e0e8f0]">
                <h2 className="text-xl font-black text-[#003087] mb-5">מחזורים ותאריכים</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {c.cycles.map((cycle, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border-2 border-[#e0e8f0] hover:border-[#003087] transition-colors p-5"
                    >
                      <div className="inline-block bg-[#003087] text-white text-xs font-black px-3 py-1 rounded-full mb-3">
                        {cycle.label}
                      </div>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        {cycle.dates && (
                          <li className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                            {cycle.dates}
                          </li>
                        )}
                        {cycle.days && (
                          <li className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                            {cycle.days}
                          </li>
                        )}
                        {cycle.hours && (
                          <li className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#003087]/40 flex-shrink-0" />
                            {cycle.hours}
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── 4. Cities ── */}
            {c.cities && c.cities.length > 0 && (
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e0e8f0]">
                <h2 className="text-xl font-black text-[#003087] mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  מיקומים
                </h2>
                <div className="flex flex-wrap gap-2">
                  {c.cities.map((city, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 bg-[#003087]/8 text-[#003087] font-medium text-sm px-4 py-2 rounded-full border border-[#003087]/20"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      {city}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* ── 5. Pricing ── */}
            {(c.price_basic || c.price_advanced) && (
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e0e8f0]">
                <h2 className="text-xl font-black text-[#003087] mb-5">תוכניות ומחירים</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {c.price_basic && (
                    <div className="rounded-2xl border-2 border-[#e0e8f0] p-6">
                      <h3 className="font-bold text-[#003087] text-base mb-2">תוכנית בסיסית</h3>
                      <p className="text-3xl font-black text-[#003087] mb-4">
                        {c.price_basic.toLocaleString("he-IL")}
                        <span className="text-lg font-bold"> ₪</span>
                      </p>
                      <ul className="space-y-2 text-sm text-gray-500">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                          כניסה לכל הפעילויות
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                          ציוד בסיסי כלול
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                          ליווי מקצועי
                        </li>
                      </ul>
                      <a
                        href="#contact-form"
                        className="mt-5 block text-center bg-[#F5F7FA] hover:bg-[#e0e8f0] text-[#003087] font-bold py-2.5 rounded-full transition-colors text-sm border border-[#e0e8f0]"
                      >
                        בחרו תוכנית זו
                      </a>
                    </div>
                  )}

                  {c.price_advanced && (
                    <div className="rounded-2xl border-2 border-[#F5C400] p-6 relative overflow-hidden">
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#F5C400] text-[#003087] text-xs font-black px-3 py-1 rounded-full">
                          מומלץ
                        </span>
                      </div>
                      <h3 className="font-bold text-[#003087] text-base mb-2">תוכנית מתקדמת</h3>
                      <p className="text-3xl font-black text-[#003087] mb-4">
                        {c.price_advanced.toLocaleString("he-IL")}
                        <span className="text-lg font-bold"> ₪</span>
                      </p>
                      <ul className="space-y-2 text-sm text-gray-500">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                          כל הכלול בבסיסי
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                          ציוד מתקדם
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                          הדרכה אישית
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                          אירועי בונוס
                        </li>
                      </ul>
                      <a
                        href="#contact-form"
                        className="mt-5 block text-center bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black py-2.5 rounded-full transition-colors text-sm"
                      >
                        בחרו תוכנית זו
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ── 6. FAQ ── */}
            {c.faq && c.faq.length > 0 && (
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e0e8f0]">
                <h2 className="text-xl font-black text-[#003087] mb-5">שאלות נפוצות</h2>
                <FaqAccordion items={c.faq} />
              </section>
            )}

            {/* Mobile contact form */}
            <div id="contact-form" className="lg:hidden bg-white rounded-2xl p-6 shadow-sm border border-[#e0e8f0]">
              <h2 className="text-xl font-black text-[#003087] mb-1">שלחו פנייה לקייטנה</h2>
              <p className="text-gray-500 text-sm mb-5">מלאו את הפרטים ונחזור אליכם בהקדם</p>
              <ContactForm campId={c.id} campName={c.name} />
            </div>

          </div>

          {/* ── RIGHT: Sticky sidebar ── */}
          <div className="hidden lg:block">
            <div
              id="contact-form"
              className="bg-white rounded-2xl shadow-lg border border-[#e0e8f0] p-6 sticky top-24"
            >
              <h2 className="text-xl font-black text-[#003087] mb-1">שלחו פנייה לקייטנה</h2>
              <p className="text-gray-500 text-sm mb-5">מלאו את הפרטים ונחזור אליכם בהקדם</p>
              <ContactForm campId={c.id} campName={c.name} />

              {c.location && (
                <div className="mt-5 pt-5 border-t border-[#e0e8f0] flex items-start gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-[#003087] flex-shrink-0 mt-0.5" />
                  <span>{c.location}</span>
                </div>
              )}

              <div className="mt-4 text-center">
                <Link
                  href="/search"
                  className="text-[#003087]/60 hover:text-[#003087] text-xs underline underline-offset-2 transition-colors"
                >
                  חזרה לכל הקייטנות
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
