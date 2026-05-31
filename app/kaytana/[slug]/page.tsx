export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  MapPin, Users, Calendar, Clock,
  Phone, Waves, Star, Anchor, Trees, Film,
  Target, Wind, Zap, Music2, ShoppingBag, Bike,
  CheckCircle, ArrowLeft,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import FaqAccordion from "@/components/FaqAccordion";
import Link from "next/link";
import type { Metadata } from "next";

/* ─── Types ─────────────────────────────────────────── */

interface Cycle  { label: string; dates: string; days: string; hours: string }
interface FaqItem { q: string; a: string }

interface Camp {
  id: string; name: string; slug: string;
  description: string | null; city: string; location: string | null;
  age_min: number; age_max: number;
  price_basic: number | null; price_advanced: number | null;
  image_url: string | null;
  activities: string[] | null;
  cycles: Cycle[] | null;
  cities: string[] | null;
  faq: FaqItem[] | null;
}

/* ─── Activity icons (keyword match → icon + color) ─── */

const ACTIVITY_STYLES: { keywords: string[]; icon: React.ElementType; bg: string; text: string }[] = [
  { keywords: ["מים","שחיי","בריכה","שייט","ים"],             icon: Waves,      bg: "bg-blue-100",   text: "text-blue-600"   },
  { keywords: ["לונה","פארק","אטרקציה","תיאטרון"],             icon: Star,       bg: "bg-yellow-100", text: "text-yellow-600" },
  { keywords: ["קולנוע","סרט"],                               icon: Film,       bg: "bg-purple-100", text: "text-purple-600" },
  { keywords: ["גן חיות","טבע","חי"],                         icon: Trees,      bg: "bg-green-100",  text: "text-green-600"  },
  { keywords: ["כדור","ספורט","כושר","טניס"],                  icon: Target,     bg: "bg-red-100",    text: "text-red-600"    },
  { keywords: ["ריקוד","מוזיקה"],                              icon: Music2,     bg: "bg-pink-100",   text: "text-pink-600"   },
  { keywords: ["אופניים","רכיבה"],                            icon: Bike,       bg: "bg-orange-100", text: "text-orange-600" },
  { keywords: ["מתנפחים","משחק"],                             icon: Wind,       bg: "bg-teal-100",   text: "text-teal-600"   },
  { keywords: ["קניות","שוק"],                                icon: ShoppingBag,bg: "bg-indigo-100", text: "text-indigo-600" },
  { keywords: ["עוגן","ספינה","אנייה"],                       icon: Anchor,     bg: "bg-cyan-100",   text: "text-cyan-600"   },
];

const FALLBACK_STYLES = [
  { bg: "bg-blue-100",   text: "text-blue-600",   icon: Zap     },
  { bg: "bg-yellow-100", text: "text-yellow-600", icon: Star    },
  { bg: "bg-green-100",  text: "text-green-600",  icon: CheckCircle },
  { bg: "bg-purple-100", text: "text-purple-600", icon: Wind    },
  { bg: "bg-pink-100",   text: "text-pink-600",   icon: Music2  },
  { bg: "bg-orange-100", text: "text-orange-600", icon: Target  },
];

function getActivityStyle(name: string, idx: number) {
  const lower = name.toLowerCase();
  const match = ACTIVITY_STYLES.find(s => s.keywords.some(k => lower.includes(k)));
  if (match) return match;
  return FALLBACK_STYLES[idx % FALLBACK_STYLES.length];
}

/* ─── Metadata ──────────────────────────────────────── */

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase.from("camps").select("name,description,city").eq("slug", params.slug).single();
  if (!data) return {};
  return {
    title: `${data.name} — קייטנות`,
    description: data.description?.slice(0, 155) ?? `קייטנה ב${data.city}`,
  };
}

/* ─── Page ──────────────────────────────────────────── */

export default async function KaytanaPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: camp } = await supabase
    .from("camps").select("*").eq("slug", params.slug).eq("is_active", true).single();
  if (!camp) notFound();
  const c = camp as Camp;

  const cityCount      = c.cities?.length ?? 0;
  const activityCount  = c.activities?.length ?? 0;
  const cycleCount     = c.cycles?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="relative min-h-[580px] md:min-h-[660px] flex items-center overflow-hidden">

        {/* Full-bleed background image — LEFT side */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.image_url ?? "https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=1400&q=80"}
            alt={c.name}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Gradient: WHITE on RIGHT (text side in RTL), transparent on LEFT (image visible) */}
          <div className="absolute inset-0 bg-gradient-to-l from-white via-white/97 to-white/0" />
        </div>

        {/* Text content — right side in RTL, dark text on white bg */}
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-lg">

            {/* Year badge */}
            <span className="inline-block bg-[#F5C400] text-[#003087] text-sm font-black px-5 py-1.5 rounded-full mb-6 shadow-md">
              קייטנות קיץ 2026
            </span>

            {/* Camp name — big */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#003087] leading-tight mb-3">
              קייטנת {c.name}
            </h1>

            {/* Tagline — slightly smaller */}
            <p className="text-xl md:text-2xl font-bold text-gray-600 mb-8 leading-snug">
              {c.activities?.length
                ? `כל האטרקציות המובילות בארץ`
                : `קייטנה לגילאי ${c.age_min}–${c.age_max}`}
            </p>

            {/* 3 trust bullets — horizontal */}
            <div className="flex flex-wrap gap-6 mb-8">
              {["מקצועיות", "בטיחות", "יחס אישי"].map((b) => (
                <span key={b} className="flex items-center gap-2 text-[#003087] font-bold text-base">
                  <CheckCircle className="w-5 h-5 text-[#F5C400] flex-shrink-0" />
                  {b}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div>
              <a
                href="#contact-form"
                className="inline-flex items-center gap-3 bg-[#F5C400] hover:bg-[#e0b200] active:scale-95 text-[#003087] font-black px-9 py-4 rounded-full text-lg transition-all shadow-xl shadow-[#F5C400]/30 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
                הבטיחו מקום עכשיו!
              </a>
              <p className="text-gray-400 text-sm mt-3 font-medium">
                מקומות מוגבלים בכל קבוצה!
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          STATS BAR
      ══════════════════════════════════ */}
      {(cityCount > 0 || activityCount > 0) && (
        <div className="bg-white border-b border-[#e0e8f0] shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap divide-x divide-x-reverse divide-[#e0e8f0]">
              {([
                cityCount > 0     ? { value: cityCount,                    label: "ערים ברחבי הארץ", Icon: MapPin   } : null,
                activityCount > 0 ? { value: activityCount,                label: "פעילויות שונות",  Icon: Star     } : null,
                                    { value: `${c.age_min}–${c.age_max}`,  label: "שנים",            Icon: Users    },
                cycleCount > 0    ? { value: cycleCount,                   label: "מחזורי קיץ",       Icon: Calendar } : null,
              ] as ({ value: string | number; label: string; Icon: React.ElementType } | null)[])
                .filter((s): s is { value: string | number; label: string; Icon: React.ElementType } => s !== null)
                .map((stat, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-4 flex-1 min-w-[120px]">
                  <stat.Icon className="w-5 h-5 text-[#F5C400] flex-shrink-0" />
                  <div>
                    <p className="text-2xl font-black text-[#003087] leading-none">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════
          MAIN LAYOUT
      ══════════════════════════════════ */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main content (2/3) ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            {c.description && (
              <section className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-[#003087] mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#F5C400] rounded-full inline-block" />
                  על הקייטנה
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">{c.description}</p>
              </section>
            )}

            {/* Activities */}
            {c.activities && c.activities.length > 0 && (
              <section className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-[#003087] mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#F5C400] rounded-full inline-block" />
                  מה עושים בקייטנה?
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {c.activities.map((act, i) => {
                    const style = getActivityStyle(act, i);
                    const Icon = style.icon;
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-[#e0e8f0] hover:border-[#003087]/30 hover:shadow-md transition-all text-center group"
                      >
                        <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-5 h-5 ${style.text}`} />
                        </div>
                        <span className="text-sm font-bold text-[#003087]">{act}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Cycles */}
            {c.cycles && c.cycles.length > 0 && (
              <section className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-[#003087] mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#F5C400] rounded-full inline-block" />
                  תאריכים ומחזורים
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {c.cycles.map((cycle, i) => (
                    <div
                      key={i}
                      className="relative rounded-2xl border-2 border-[#e0e8f0] hover:border-[#003087] transition-colors p-5 overflow-hidden group"
                    >
                      {/* Accent bar */}
                      <div className="absolute top-0 right-0 w-1 h-full bg-[#F5C400] rounded-r-2xl" />
                      <span className="inline-block bg-[#003087] text-white text-xs font-black px-3 py-1 rounded-full mb-4">
                        {cycle.label}
                      </span>
                      <ul className="space-y-2">
                        {cycle.dates && (
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                            <span className="font-medium">{cycle.dates}</span>
                          </li>
                        )}
                        {cycle.days && (
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                            <span>{cycle.days}</span>
                          </li>
                        )}
                        {cycle.hours && (
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <Clock className="w-4 h-4 text-[#003087]/40 flex-shrink-0" />
                            <span>{cycle.hours}</span>
                          </li>
                        )}
                      </ul>
                      <a
                        href="#contact-form"
                        className="mt-4 block w-full text-center bg-[#F5F7FA] hover:bg-[#F5C400] hover:text-[#003087] text-[#003087] text-xs font-bold py-2 rounded-full transition-colors border border-[#e0e8f0] hover:border-[#F5C400]"
                      >
                        הרשמה למחזור זה
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Cities */}
            {c.cities && c.cities.length > 0 && (
              <section className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-[#003087] mb-2 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#F5C400] rounded-full inline-block" />
                  איפה הקייטנה פועלת?
                </h2>
                <p className="text-gray-500 text-sm mb-4">הקייטנה פועלת ב-{c.cities.length} ערים ברחבי הארץ</p>
                <div className="flex flex-wrap gap-2">
                  {c.cities.map((city, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 bg-[#F5F7FA] hover:bg-[#003087] hover:text-white text-[#003087] font-medium text-sm px-4 py-2 rounded-full border border-[#e0e8f0] hover:border-[#003087] transition-colors cursor-default"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      {city}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Pricing */}
            {(c.price_basic || c.price_advanced) && (
              <section className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-[#003087] mb-2 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#F5C400] rounded-full inline-block" />
                  תוכניות ומחירים
                </h2>
                <p className="text-gray-500 text-sm mb-6">בחרו את התוכנית המתאימה לכם</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {c.price_basic && (
                    <div className="rounded-2xl border-2 border-[#e0e8f0] p-6 flex flex-col">
                      <p className="text-sm font-bold text-gray-500 mb-1">תוכנית בסיסית</p>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-4xl font-black text-[#003087]">{c.price_basic.toLocaleString("he-IL")}</span>
                        <span className="text-lg font-bold text-[#003087]">₪</span>
                        <span className="text-gray-400 text-sm">/ מחזור</span>
                      </div>
                      <ul className="space-y-2.5 text-sm text-gray-600 flex-1 mb-6">
                        {["כניסה לכל הפעילויות", "ציוד בסיסי כלול", "ליווי מקצועי", "ביטוח"].map(f => (
                          <li key={f} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#F5C400] flex-shrink-0" />{f}
                          </li>
                        ))}
                      </ul>
                      <a href="#contact-form" className="block text-center bg-[#F5F7FA] hover:bg-[#003087] hover:text-white text-[#003087] font-bold py-3 rounded-full transition-colors border border-[#e0e8f0] hover:border-[#003087] text-sm">
                        בחרו תוכנית זו
                      </a>
                    </div>
                  )}

                  {c.price_advanced && (
                    <div className="rounded-2xl border-2 border-[#F5C400] p-6 flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5C400]" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#F5C400] text-[#003087] text-xs font-black px-3 py-1 rounded-full">
                          הכי פופולרי
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-500 mb-1 mt-6">תוכנית מתקדמת</p>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-4xl font-black text-[#003087]">{c.price_advanced.toLocaleString("he-IL")}</span>
                        <span className="text-lg font-bold text-[#003087]">₪</span>
                        <span className="text-gray-400 text-sm">/ מחזור</span>
                      </div>
                      <ul className="space-y-2.5 text-sm text-gray-600 flex-1 mb-6">
                        {["כל הכלול בבסיסי", "ציוד מתקדם", "הדרכה אישית", "אירועי בונוס", "תמונות וסרטון סיום"].map(f => (
                          <li key={f} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#F5C400] flex-shrink-0" />{f}
                          </li>
                        ))}
                      </ul>
                      <a href="#contact-form" className="block text-center bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black py-3 rounded-full transition-colors text-sm shadow-md shadow-[#F5C400]/40">
                        בחרו תוכנית זו
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* FAQ */}
            {c.faq && c.faq.length > 0 && (
              <section className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-black text-[#003087] mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#F5C400] rounded-full inline-block" />
                  שאלות נפוצות
                </h2>
                <FaqAccordion items={c.faq} />
              </section>
            )}

            {/* Mobile form */}
            <div id="contact-form" className="lg:hidden bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-6">
              <h2 className="text-xl font-black text-[#003087] mb-1">שלחו פנייה לקייטנה</h2>
              <p className="text-gray-500 text-sm mb-5">נציג יחזור אליכם תוך 24 שעות</p>
              <ContactForm campId={c.id} campName={c.name} />
            </div>

          </div>

          {/* ── Sidebar (1/3) ── */}
          <div className="hidden lg:block">
            <div id="contact-form" className="bg-white rounded-2xl border border-[#e0e8f0] shadow-lg p-6 sticky top-6">

              {/* Price teaser */}
              {c.price_basic && (
                <div className="bg-[#003087] rounded-xl p-4 mb-5 text-center">
                  <p className="text-blue-200 text-xs mb-1">החל מ</p>
                  <p className="text-3xl font-black text-white">{c.price_basic.toLocaleString("he-IL")} <span className="text-lg">₪</span></p>
                  <p className="text-blue-200 text-xs mt-1">למחזור</p>
                </div>
              )}

              <h2 className="text-lg font-black text-[#003087] mb-1">שלחו פנייה לקייטנה</h2>
              <p className="text-gray-500 text-xs mb-4">נציג יחזור אליכם תוך 24 שעות</p>

              <ContactForm campId={c.id} campName={c.name} />

              {/* Contact + location */}
              <div className="mt-5 pt-5 border-t border-[#e0e8f0] space-y-2">
                <a href="tel:050-1234567" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#003087] transition-colors">
                  <Phone className="w-4 h-4 text-[#003087]" />
                  050-1234567
                </a>
                {c.location && (
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-[#003087] flex-shrink-0 mt-0.5" />
                    <span>{c.location}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <Link href="/search" className="text-[#003087]/40 hover:text-[#003087] text-xs transition-colors">
                  ← חזרה לכל הקייטנות
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════
          BOTTOM CTA STRIP
      ══════════════════════════════════ */}
      <div className="bg-[#003087] py-12 px-4 mt-6">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            רוצים לשריין מקום?
          </h2>
          <p className="text-blue-200 text-sm mb-6">המקומות מוגבלים — הירשמו עכשיו לפני שייגמר</p>
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black px-10 py-4 rounded-full transition-colors text-base shadow-lg shadow-[#F5C400]/30"
          >
            שלחו פנייה עכשיו
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════
          MOBILE STICKY BOTTOM BAR
      ══════════════════════════════════ */}
      <div className="lg:hidden fixed bottom-0 right-0 left-0 z-40 bg-white border-t border-[#e0e8f0] shadow-2xl px-4 py-3">
        <div className="flex items-center gap-3">
          {c.price_basic && (
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-400">החל מ</p>
              <p className="font-black text-[#003087] text-lg leading-none">{c.price_basic.toLocaleString("he-IL")} ₪</p>
            </div>
          )}
          <a
            href="#contact-form"
            className="flex-1 bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black py-3.5 rounded-full text-center transition-colors text-sm"
          >
            להרשמה ופרטים
          </a>
          <a
            href="tel:050-1234567"
            className="w-12 h-12 bg-[#003087] rounded-full flex items-center justify-center flex-shrink-0"
          >
            <Phone className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>
      {/* Bottom padding for mobile sticky bar */}
      <div className="lg:hidden h-20" />

    </div>
  );
}
