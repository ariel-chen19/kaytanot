export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import CampCard from "@/components/CampCard";
import HeroSearch from "@/components/HeroSearch";
import LeadFormSection from "@/components/LeadFormSection";
import Link from "next/link";
import { Check, Shield, Star, Trophy, Heart, Calendar, Users } from "lucide-react";

/* ─── UNSPLASH IMAGE CONSTANTS ──────────────────────────── */

const HERO_IMG = "https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=800";

const PLACEHOLDER_CAMPS = [
  {
    name: "קייטנת חוויה אולימפית",
    subtitle: "בוחרים מסלול אחד ומתמקצעים",
    img: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400",
    icons: ["🏊", "⚽", "🎾", "🏃"],
  },
  {
    name: "קייטנת ספורט מקצועית",
    subtitle: "תכנית אינטנסיבית לאוהבי הספורט",
    img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
    icons: ["⚽", "🏊", "🎾", "🏃"],
  },
  {
    name: "קייטנת שחייה ומים",
    subtitle: "ספורט מים, בטיחות ומיומנויות",
    img: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400",
    icons: ["🏊", "🤽", "🏄", "💧"],
  },
  {
    name: "קייטנת ריקוד ואומנות",
    subtitle: "ביטוי עצמי, קצב ויצירתיות",
    img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400",
    icons: ["💃", "🎵", "🎨", "🎭"],
  },
];

const CATEGORIES = [
  {
    icon: "🏃",
    label: "ריקוד",
    desc: "פיתוח קואורדינציה, קצב וביטוי עצמי עם מדריכים מקצועיים",
    images: [
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
      "https://images.unsplash.com/photo-1535525153412-5a0dfab02a30?w=400",
    ],
  },
  {
    icon: "🎾",
    label: "טניס",
    desc: "ללמוד את המשחק, הטכניקה ולשפר יכולות עם מאמנים מוסמכים",
    images: [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400",
    ],
  },
  {
    icon: "🏊",
    label: "שחייה",
    desc: "לחוות ספורט מים מהנה ולשפר יחד עם מדריכים מוסמכים",
    images: [
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400",
      "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400",
      "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400",
    ],
  },
  {
    icon: "⚽",
    label: "כדורגל",
    desc: "שיפור טכניקה, עבודת צוות ותחרות עם מאמן מקצועי",
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400",
    ],
  },
];

const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=400",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
  "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400",
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400",
];

const PARTNERS = [
  { name: "הסתדרות", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { name: "שווה", color: "bg-green-100 text-green-800 border-green-200" },
  { name: "קרן טוב", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { name: "אנוש", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { name: "קרנות", color: "bg-red-100 text-red-800 border-red-200" },
  { name: "מפעל הפיס", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
];

const BENEFITS = [
  { icon: Users, label: "צוות מקצועי", desc: "מדריכים מוסמכים ומנוסים" },
  { icon: Shield, label: "בטיחות מעל הכל", desc: "פיקוח צמוד על כל ילד" },
  { icon: Heart, label: "יחס אישי", desc: "מכירים כל ילד ומשפחה" },
  { icon: Trophy, label: "פיתוח והצלחה", desc: "מטרות ברורות ותוצאות" },
  { icon: Star, label: "סביבה חיובית", desc: "חברה, ערכים ואווירה חמה" },
  { icon: Calendar, label: "תכנית מגובשת", desc: "פעילויות יומיות מסודרות" },
];

const HERO_BULLETS = [
  "מקצועיות מובילה בישראל",
  "בטיחות מעל הכל",
  "קייטנות לכל גיל ותחום",
  "מדריכים מוסמכים ומנוסים",
];

/* ─── PAGE ──────────────────────────────────────────────── */

export default async function HomePage() {
  const supabase = createClient();
  const { data: camps } = await supabase
    .from("camps")
    .select("id, name, slug, description, city, age_min, age_max, image_url, price_basic")
    .eq("is_active", true)
    .limit(4);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          1. HERO — split layout
      ══════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-[#003087] via-[#0a3fa0] to-[#1a4aa8] text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[580px]">

            {/* Text — right side (RTL) */}
            <div className="py-16 lg:py-20 order-2 lg:order-1 flex flex-col justify-center">
              <div className="inline-block bg-[#F5C400]/20 text-[#F5C400] text-xs font-bold px-4 py-1.5 rounded-full mb-5 w-fit">
                ✨ קייטנות קיץ 2026
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                מצאו את הקייטנה
                <br />
                <span className="text-[#F5C400]">המושלמת</span>
                <br />
                לילד שלכם!
              </h1>

              <ul className="space-y-2.5 mb-8">
                {HERO_BULLETS.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-base text-blue-100">
                    <span className="w-5 h-5 rounded-full bg-green-400/20 border border-green-400 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-400" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black text-base px-8 py-3.5 rounded-full transition-colors"
                >
                  הבטיחו מקום עכשיו »
                </Link>
                <Link
                  href="#camps"
                  className="inline-flex items-center justify-center border-2 border-white/30 hover:border-white text-white font-bold text-base px-8 py-3.5 rounded-full transition-colors"
                >
                  לכל הקייטנות
                </Link>
              </div>

              <HeroSearch />
            </div>

            {/* Image — left side */}
            <div className="relative order-1 lg:order-2 overflow-hidden min-h-[280px]">
              {/* overlay gradient for text readability on mobile */}
              <div className="absolute inset-0 bg-gradient-to-l from-[#003087]/70 via-transparent to-transparent z-10 lg:hidden" />
              {/* Real Unsplash image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_IMG}
                alt="ילדים רצים בקייטנה"
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
              {/* Decorative circles */}
              <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#F5C400]/10 hidden lg:block pointer-events-none" />
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 hidden lg:block pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. CAMPS — "הורים בוחרים"
      ══════════════════════════════════════════════ */}
      <section id="camps" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#003087]/60 text-sm font-semibold uppercase tracking-widest mb-2">הורים בוחרים</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#003087]">
              את הקייטנה שמתאימה לילד שלכם
            </h2>
          </div>

          {camps && camps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {camps.map((camp) => (
                <CampCard key={camp.id} camp={camp} />
              ))}
            </div>
          ) : (
            /* Placeholder cards with real images */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {PLACEHOLDER_CAMPS.map((c) => (
                <div key={c.name} className="bg-white rounded-2xl shadow-md border border-[#e0e8f0] overflow-hidden flex flex-col">
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.img}
                      alt={c.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="font-extrabold text-lg text-[#003087] mb-1 leading-tight">{c.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">{c.subtitle}</p>
                    <div className="flex gap-2 text-xl mb-5 flex-1">
                      {c.icons.map((ic, i) => <span key={i}>{ic}</span>)}
                    </div>
                    <Link
                      href="/search"
                      className="block w-full text-center bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-bold py-3 rounded-full transition-colors text-sm"
                    >
                      לפרטים והרשמה »
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 border-2 border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white font-bold px-8 py-3 rounded-full transition-colors"
            >
              כל הקייטנות
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. CATEGORIES — icon + desc + 3 images
      ══════════════════════════════════════════════ */}
      <section id="categories" className="py-16 px-4 bg-[#F5F7FA]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#003087]/60 text-sm font-semibold uppercase tracking-widest mb-2">מסלולים</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#003087]">
              בחרו מסלול שמתאים לילד שלכם
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              מסלולי הספורט שלנו מפולחים מקצועית, ועל ידי מדריכים מנוסים לכל גיל
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={`/search?category=${encodeURIComponent(cat.label)}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e0e8f0] group"
              >
                {/* Icon + label */}
                <div className="p-5 pb-3">
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <h3 className="font-extrabold text-lg text-[#003087] mb-1">{cat.label}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{cat.desc}</p>
                </div>

                {/* 3 real images */}
                <div className="grid grid-cols-3 gap-1 p-2 pt-1">
                  {cat.images.map((src, n) => (
                    <div key={n} className="h-20 rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={cat.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. BENEFITS — 6 icons in a row
      ══════════════════════════════════════════════ */}
      <section id="benefits" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#003087]/60 text-sm font-semibold uppercase tracking-widest mb-2">היתרונות שלנו</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#003087]">למה לבחור בנו?</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="flex flex-col items-center text-center group cursor-default">
                  <div className="w-16 h-16 rounded-full bg-[#003087]/8 flex items-center justify-center mb-3 group-hover:bg-[#003087] transition-colors duration-300">
                    <Icon className="w-7 h-7 text-[#003087] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-sm text-[#003087] mb-1">{b.label}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. PARTNERSHIP BANNER — colorful partner chips
      ══════════════════════════════════════════════ */}
      <section className="bg-[#F5F7FA] py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-[#003087] mb-3">
            רשת הקייטנות הארצית פועלת עם ועדי עובדים וארגונים
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8 text-sm leading-relaxed">
            הגופים הגדולים לעובדים במשק בהסדרים מיוחדים ומסובסדים. לפרטים ולהרשמה לחצו על הקישור
            ובחרו את הקייטנה שלכם — אל תפספסו את הקיץ הכי טוב!
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {PARTNERS.map(({ name, color }) => (
              <div
                key={name}
                className={`border rounded-2xl px-6 py-3 font-bold text-sm shadow-sm ${color} hover:shadow-md transition-shadow cursor-default`}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. LEAD FORM — split layout
      ══════════════════════════════════════════════ */}
      <section id="contact">
        <LeadFormSection />
      </section>

      {/* ══════════════════════════════════════════════
          7. PHOTO GALLERY — real Unsplash images
      ══════════════════════════════════════════════ */}
      <section className="py-10 bg-[#F5F7FA]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-black text-[#003087] text-center mb-6">הצצה לחוויית הקייטנות</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY_IMGS.map((src, i) => (
              <div key={i} className="h-40 md:h-52 rounded-2xl overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`קייטנה תמונה ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. BOTTOM CTA
      ══════════════════════════════════════════════ */}
      <section className="bg-[#003087] text-white py-14 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div>
              <div className="inline-block bg-[#F5C400] text-[#003087] text-xs font-black px-4 py-1.5 rounded-full mb-4">
                מקומות מוגבלים!
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-3">
                הפכו מוקדם כבר עכשיו!
              </h2>
              <p className="text-blue-200 text-lg">
                אל תפספסו את הקיץ הכי טוב של ילדכם — הבטיחו מקום לפני שייגמרו.
              </p>
            </div>
            {/* Mini form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <p className="font-bold text-lg mb-4 text-center">השאירו פרטים ונחזור אליכם</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="שם הילד"
                  className="h-11 rounded-full bg-white/20 border border-white/30 px-4 text-white placeholder:text-white/60 text-sm focus:outline-none focus:border-[#F5C400]"
                />
                <input
                  type="text"
                  placeholder="שם משפחה"
                  className="h-11 rounded-full bg-white/20 border border-white/30 px-4 text-white placeholder:text-white/60 text-sm focus:outline-none focus:border-[#F5C400]"
                />
                <input
                  type="tel"
                  placeholder="טלפון"
                  dir="ltr"
                  className="h-11 rounded-full bg-white/20 border border-white/30 px-4 text-white placeholder:text-white/60 text-sm focus:outline-none focus:border-[#F5C400]"
                />
                <input
                  type="number"
                  placeholder="גיל הילד"
                  min={3}
                  max={18}
                  className="h-11 rounded-full bg-white/20 border border-white/30 px-4 text-white placeholder:text-white/60 text-sm focus:outline-none focus:border-[#F5C400]"
                />
              </div>
              <Link
                href="/search"
                className="block w-full text-center bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black py-3 rounded-full transition-colors"
              >
                שלח פרטים »
              </Link>
              <p className="text-center text-blue-200/60 text-xs mt-3 flex items-center justify-center gap-1">
                🔒 הפרטים מוצפנים ולא יועברו לגורם אחר
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
