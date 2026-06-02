export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  MapPin, Users, Calendar,
  Phone, Waves, Star, Anchor, Trees, Film,
  Target, Wind, Zap, Music2, ShoppingBag, Bike,
  CheckCircle, ArrowLeft, Shield, Bus, UtensilsCrossed, Award,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import CyclesAndPricing from "@/components/CyclesAndPricing";
import ActivitiesGallery from "@/components/ActivitiesGallery";
import FaqAccordion from "@/components/FaqAccordion";
import Link from "next/link";
import type { Metadata } from "next";

/* ─── Types ─────────────────────────────────────────── */

interface Cycle  { label: string; dates: string; days: string; hours: string }
interface FaqItem { q: string; a: string }

interface Feature { type: string; label: string; desc: string }

interface CityPrice { city: string; price: number }

interface Camp {
  id: string; name: string; slug: string;
  description: string | null; city: string; location: string | null;
  age_min: number; age_max: number;
  price_basic: number | null; price_advanced: number | null;
  image_url: string | null;
  logo_url?: string | null;
  tagline?: string | null;
  whatsapp?: string | null;
  activities: string[] | null;
  cycles: Cycle[] | null;
  cities: string[] | null;
  faq: FaqItem[] | null;
  features?: Feature[] | null;
  city_prices?: CityPrice[] | null;
  why_us?: string[] | null;
  activities_gallery?: { name: string; image: string }[] | null;
}

/* ─── Feature icon mapping ───────────────────────────────── */
const FEATURE_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  safety:     { icon: Shield,           color: "text-blue-600"   },
  transport:  { icon: Bus,              color: "text-orange-500" },
  food:       { icon: UtensilsCrossed,  color: "text-green-600"  },
  ratio:      { icon: Users,            color: "text-purple-600" },
  experience: { icon: Award,            color: "text-yellow-500" },
  pool:       { icon: Waves,            color: "text-cyan-600"   },
  sport:      { icon: Target,           color: "text-red-600"    },
  art:        { icon: Music2,           color: "text-pink-600"   },
  nature:     { icon: Trees,            color: "text-green-700"  },
  personal:   { icon: CheckCircle,      color: "text-blue-500"   },
};

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

  // Supabase may return jsonb as string — parse if needed
  if (c.features && typeof c.features === "string") {
    c.features = JSON.parse(c.features);
  }

  const cityCount  = c.cities?.length ?? 0;
  const cycleCount = c.cycles?.length ?? 0;

  return (
    <div className="min-h-screen bg-white">

      {/* ══════════════════════════════════
          HERO — split layout
      ══════════════════════════════════ */}
      <div className="flex flex-col md:flex-row bg-white" style={{ minHeight: "580px" }}>

        {/* RIGHT: White text panel */}
        <div className="w-full md:w-[45%] flex flex-col justify-center items-center text-center px-8 md:px-12 lg:px-16 py-10 order-2 md:order-1">

          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.logo_url ?? "/kaytanot_logo.webp"}
            alt={c.name}
            className="h-24 object-contain mb-4"
          />

          {/* Title */}
          <p className="text-5xl md:text-6xl font-black text-[#182e86] leading-tight mb-0">קייטנת</p>
          <h1 className="text-5xl md:text-6xl font-black text-[#182e86] leading-tight mb-3">
            {c.name}
          </h1>

          {/* Tagline */}
          <p className="text-gray-900 text-lg mb-2">
            {c.tagline ?? (c.activities?.length ? "כל יום אטרקציה חדשה והרפתקה אחרת!" : `קייטנה לגילאי ${c.age_min}–${c.age_max}`)}
          </p>
          <div className="w-14 h-1 bg-[#F5C400] rounded-full mb-6" />

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-gray-800 text-base">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#182e86]" />
              <span>גילאי {c.age_min}-{c.age_max}</span>
            </div>
            {cycleCount > 0 && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#182e86]" />
                <span>{cycleCount === 1 ? c.cycles![0].dates : `${cycleCount} מחזורים`}</span>
              </div>
            )}
            {cityCount > 0 && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#182e86]" />
                <span>{cityCount} ערים ברחבי הארץ</span>
              </div>
            )}
          </div>

          {/* Price */}
          {c.price_basic && (
            <div className="mb-6">
              <p className="text-gray-700 text-sm">החל מ-</p>
              <p className="text-5xl font-black text-[#182e86] leading-none">
                ₪ {c.price_basic.toLocaleString("he-IL")}
              </p>
            </div>
          )}

          {/* CTA */}
          <a
            href="#contact-form"
            className="inline-flex items-center justify-center gap-3 bg-[#F5C400] hover:bg-[#e0b200] text-[#182e86] font-black px-8 py-4 rounded-xl text-lg shadow-lg hover:scale-105 transition-all mb-3 w-full max-w-xs"
          >
            <ArrowLeft className="w-5 h-5" />
            לפרטים והרשמה
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${c.whatsapp ?? "972501234567"}`}
            className="flex items-center gap-2 text-gray-400 hover:text-green-600 text-sm transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            או שלחו לנו הודעה בוואטסאפ
          </a>

        </div>

        {/* LEFT: Image with smooth white fade on right edge (toward text panel) */}
        <div className="relative w-full md:w-[55%] min-h-[280px] md:min-h-[580px] order-1 md:order-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.image_url ?? "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=80"}
            alt={c.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* White fade on the right edge of the image (toward the text panel) */}
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white to-transparent" />
        </div>

      </div>

      {/* ══════════════════════════════════
          FEATURES BAR
      ══════════════════════════════════ */}
      {c.features && Array.isArray(c.features) && c.features.length > 0 && (
        <div className="bg-white px-4 pb-6 -mt-6">
          <div className="container mx-auto">
            <div className="bg-white rounded-2xl shadow-md grid grid-cols-2 md:grid-cols-5 divide-x divide-x-reverse divide-[#e0e8f0]">
              {c.features.slice(0, 5).map((feat, i) => {
                const iconDef = FEATURE_ICONS[feat.type] ?? { icon: CheckCircle, color: "text-[#182e86]" };
                const Icon = iconDef.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center gap-2 px-4 py-7">
                    <Icon className={`w-8 h-8 ${iconDef.color}`} />
                    <p className="font-black text-[#182e86] text-base leading-tight">{feat.label}</p>
                    {feat.desc && <p className="text-gray-900 text-sm leading-snug">{feat.desc}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════
          MAIN LAYOUT (sidebar sticky throughout)
      ══════════════════════════════════ */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Main content (2/3) ── */}
          <div className="lg:col-span-2 space-y-12">

            {/* About */}
            {c.description && (
              <section>
                <h2 className="text-2xl font-black text-[#182e86] mb-1">על הקייטנה</h2>
                <div className="w-10 h-1 bg-[#F5C400] rounded-full mb-5" />
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap text-base md:text-lg">{c.description}</p>
              </section>
            )}

            {/* Why us */}
            {c.why_us && c.why_us.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-[#182e86] mb-1">למה לבחור דווקא בנו?</h2>
                <div className="w-10 h-1 bg-[#F5C400] rounded-full mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {c.why_us.slice(0, 10).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#182e86] flex items-center justify-center">
                        <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="text-gray-900 text-sm font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}


            {/* Activities Gallery */}
            {c.activities_gallery && c.activities_gallery.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-[#182e86] mb-1">מה עושים בקייטנה?</h2>
                <div className="w-10 h-1 bg-[#F5C400] rounded-full mb-6" />
                <ActivitiesGallery items={c.activities_gallery} />
              </section>
            )}

            {/* Cycles + Pricing */}
            {c.cycles && c.cycles.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-[#182e86] mb-1">מחזורים ומחירים</h2>
                <div className="w-10 h-1 bg-[#F5C400] rounded-full mb-6" />
                <CyclesAndPricing
                  cycles={c.cycles}
                  cityPrices={c.city_prices}
                  priceBasic={c.price_basic}
                />
              </section>
            )}

            {/* FAQ */}
            {c.faq && c.faq.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-[#182e86] mb-1">שאלות נפוצות</h2>
                <div className="w-10 h-1 bg-[#F5C400] rounded-full mb-6" />
                <FaqAccordion items={c.faq} />
              </section>
            )}

            {/* Mobile form */}
            <div id="contact-form" className="lg:hidden bg-white rounded-2xl border border-gray-200 shadow-md p-6">
              <h2 className="text-2xl font-black text-[#182e86] mb-1">שריינו מקום עכשיו</h2>
              <p className="text-gray-900 text-base mb-5">נציג יחזור אליכם תוך 24 שעות</p>
              <ContactForm campId={c.id} campName={c.name} />
            </div>

          </div>

          {/* ── Sidebar (1/3) ── */}
          <div className="hidden lg:block">
            <div id="contact-form" className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sticky top-6">

              {/* Camp name header */}
              <div className="bg-[#182e86] rounded-xl p-4 mb-5 text-center">
                <p className="text-blue-200 text-xs mb-1">קייטנת</p>
                <p className="text-xl font-black text-white leading-tight">{c.name}</p>
              </div>

              <h2 className="text-xl font-black text-[#182e86] mb-1">שריינו מקום עכשיו</h2>
              <p className="text-gray-900 text-sm mb-4">נציג יחזור אליכם תוך 24 שעות</p>

              <ContactForm campId={c.id} campName={c.name} />

              {/* Contact + location */}
              <div className="mt-5 pt-5 border-t border-[#e0e8f0] space-y-2">
                <a href="tel:050-1234567" className="flex items-center gap-2 text-sm text-gray-800 hover:text-[#003087] transition-colors">
                  <Phone className="w-4 h-4 text-[#003087]" />
                  050-1234567
                </a>
                {c.location && (
                  <div className="flex items-start gap-2 text-sm text-gray-800">
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
