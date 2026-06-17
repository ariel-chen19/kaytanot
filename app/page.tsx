export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Activity,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  TicketPercent,
  Users,
} from "lucide-react";

const HERO_IMG = "/kaytanot/kaytanot-israel-hero.webp";
const LOGO_IMG = "/kaytanot/kaytanot_logo.webp";

const CITIES = [
  "אזור",
  "אשדוד",
  "אשקלון",
  "באר יעקב",
  "בת ים",
  "גבעתיים",
  "גן יבנה",
  "הוד השרון",
  "חולון",
  "יבנה",
  "יישובי לב השרון",
  "כפר יונה",
  "מ.א. גן רווה",
  "נס ציונה",
  "נתניה",
  "פתח תקווה",
  "ראש העין",
  "ראשון לציון",
  "רחובות",
  "רמלה",
  "רמת גן",
  "תל אביב",
];

const CAMP_TYPES = ["אטרקציות", "ספורט", "שחייה", "אומנות", "טכנולוגיה", "צהרונים"];
const AGE_RANGES = ["3-5", "6-8", "9-11", "12-14"];

const FEATURED_FALLBACK = [
  {
    name: "קייטנת מתגלגלים ונהנים",
    subtitle: "קייטנת אטרקציות עם איסוף מבית הספר הקרוב לבית",
    city: "23 ערים ברחבי הארץ",
    ages: "6-13",
    price: "החל מ-2,690 ₪",
    image: "/mitgalgalim/mitgalgalim.webp",
    href: "/kaytana/mitgalgalim",
    badges: ["אטרקציות", "27+ שנות ניסיון", "הטבות דרך ארגונים"],
  },
  {
    name: "קייטנת חוויה אולימפית",
    subtitle: "מסלולי ספורט, תנועה וחוויה לילדים שאוהבים לזוז",
    city: "ערים נבחרות",
    ages: "6-14",
    price: "פרטים בקרוב",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900",
    href: "/search",
    badges: ["ספורט", "קבוצות גיל", "צוות מקצועי"],
  },
];

const CATEGORY_CARDS = [
  { icon: Sparkles, title: "קייטנות אטרקציות", text: "ימי פעילות משתנים, פארקים, מים, קולנוע, באולינג וחוויות גדולות." },
  { icon: Activity, title: "קייטנות ספורט", text: "כדורגל, טניס, תנועה, משחקי קבוצה ומסלולים לילדים פעילים." },
  { icon: BookOpen, title: "קייטנות העשרה", text: "יצירה, טכנולוגיה, מדע, אומנות ותוכן שמפתח סקרנות." },
  { icon: Users, title: "צהרונים ומסגרות", text: "פתרונות להורים שמחפשים רצף יום, יחס אישי וסביבה קבועה." },
];

const TRUST_ITEMS = [
  { icon: Search, title: "חיפוש במקום אחד", text: "עיר, גיל, תאריכים וסוג פעילות בלי לפתוח עשרות אתרים." },
  { icon: ShieldCheck, title: "מידע ברור לפני פנייה", text: "גילאים, אזורי יציאה, אופי הפעילות, מחיר והטבות כשיש." },
  { icon: HeartHandshake, title: "עזרה בהחלטה", text: "אם לא בטוחים מה מתאים, משאירים פרטים ונכוון לקייטנה הנכונה." },
];

const STEPS = [
  { step: "01", title: "בוחרים עיר וגיל", text: "מתחילים מהפרטים הכי חשובים ומצמצמים רעש." },
  { step: "02", title: "משווים קייטנות", text: "בודקים פעילות, מחיר, הסעות, הטבות והתאמה לילד." },
  { step: "03", title: "משאירים פרטים", text: "מקבלים המשך הרשמה או שיחה מסודרת מול הקייטנה." },
];

const BLOG_POSTS = [
  { title: "איך לבחור קייטנה שמתאימה לילד שלכם", href: "/blog/how-to-choose-summer-camp" },
  { title: "רשימת בדיקות לפני הרשמה לקייטנה", href: "/blog/summer-camps-2026-checklist" },
  { title: "מה חשוב לדעת על קייטנה עם הסעות", href: "/blog/camp-with-transportation" },
];

const FAQ = [
  { q: "האם כל הקייטנות מופיעות באתר?", a: "לא. אנחנו מציגים קייטנות שעוברות אצלנו בדיקה בסיסית ושיש להן פרטים ברורים להורים." },
  { q: "אפשר לקבל עזרה בהתאמה?", a: "כן. אם לא מצאתם התאמה מדויקת, אפשר להשאיר פרטים ונחזור אליכם עם אפשרויות רלוונטיות." },
  { q: "איך יודעים אם יש הטבה דרך ארגון?", a: "בעמודי הקייטנות נציג הטבות זמינות, ואפשר לפנות בוואטסאפ לבירור זכאות ואופן הרשמה." },
];

const PARTNER_LOGOS = [
  { src: "/logo/hever-logo.webp", alt: "חבר" },
  { src: "/logo/ashmoret-logo.webp", alt: "אשמורת" },
  { src: "/logo/tov-plus-logo.webp", alt: "טוב פלוס" },
  { src: "/logo/histadrut-logo.webp", alt: "הסתדרות" },
  { src: "/logo/bank-leumi-logo.webp", alt: "לאומי" },
  { src: "/logo/mizrahi-tefahot-logo.webp", alt: "מזרחי טפחות" },
  { src: "/logo/discount-logo.webp", alt: "דיסקונט" },
  { src: "/logo/israel-teachers-union-logo.webp", alt: "ארגון המורים" },
];

const WHATSAPP_URL = "https://wa.me/972559999139?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%97%D7%A4%D7%A9%2F%D7%AA%20%D7%A7%D7%99%D7%99%D7%98%D7%A0%D7%94%20%D7%9E%D7%AA%D7%90%D7%99%D7%9E%D7%94%20%D7%9C%D7%99%D7%9C%D7%93%D7%99%D7%9D";

type CampRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  city: string | null;
  age_min: number | null;
  age_max: number | null;
  image_url: string | null;
  price_basic: number | null;
};

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="mb-2 text-sm font-black text-[#F5C400]">{eyebrow}</p>
      <h2 className="text-3xl font-black leading-tight text-[#003087] md:text-4xl">{title}</h2>
      {text && <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600">{text}</p>}
    </div>
  );
}

function SearchPanel() {
  return (
    <div className="relative z-20 mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl md:p-7">
      <h2 className="mb-6 text-center text-2xl font-black text-[#003087] md:text-3xl">
        חפשו קייטנה שמתאימה לילדים שלכם
      </h2>
      <div className="flex flex-col items-stretch gap-3 lg:flex-row">
        <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-4">
          <label className="flex h-14 items-center gap-3 rounded-xl border border-slate-200 px-4 transition hover:border-[#003087]">
            <MapPin className="h-5 w-5 shrink-0 text-[#003087]" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[#003087]">עיר</span>
              <select className="w-full cursor-pointer appearance-none bg-transparent text-sm text-slate-500 outline-none">
                <option value="">בחרו עיר</option>
                {CITIES.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </label>

          <label className="flex h-14 items-center gap-3 rounded-xl border border-slate-200 px-4 transition hover:border-[#003087]">
            <Users className="h-5 w-5 shrink-0 text-[#003087]" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[#003087]">גיל הילד/ה</span>
              <select className="w-full cursor-pointer appearance-none bg-transparent text-sm text-slate-500 outline-none">
                <option value="">בחרו גיל</option>
                {AGE_RANGES.map((age) => (
                  <option key={age}>{age}</option>
                ))}
              </select>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </label>

          <label className="flex h-14 items-center gap-3 rounded-xl border border-slate-200 px-4 transition hover:border-[#003087]">
            <Activity className="h-5 w-5 shrink-0 text-[#003087]" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[#003087]">סוג קייטנה</span>
              <select className="w-full cursor-pointer appearance-none bg-transparent text-sm text-slate-500 outline-none">
                <option value="">בחרו תחום</option>
                {CAMP_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </label>

          <label className="flex h-14 items-center gap-3 rounded-xl border border-slate-200 px-4 transition hover:border-[#003087]">
            <Calendar className="h-5 w-5 shrink-0 text-[#003087]" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[#003087]">תאריכים</span>
              <select className="w-full cursor-pointer appearance-none bg-transparent text-sm text-slate-500 outline-none">
                <option value="">בחרו תאריכים</option>
                <option>יולי 2026</option>
                <option>אוגוסט 2026</option>
                <option>יולי-אוגוסט 2026</option>
              </select>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </label>
        </div>

        <Link
          href="/search"
          className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F5C400] px-8 text-base font-black text-[#003087] transition hover:bg-[#e0b200]"
        >
          <Search className="h-5 w-5" />
          מצאו קייטנה
        </Link>
      </div>
    </div>
  );
}

function CampPreviewCard({ camp }: { camp: (typeof FEATURED_FALLBACK)[number] }) {
  return (
    <Link href={camp.href} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={camp.image} alt={camp.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute right-3 top-3 rounded-full bg-[#F5C400] px-3 py-1 text-xs font-black text-[#003087]">
          {camp.price}
        </div>
      </div>
      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {camp.badges.map((badge) => (
            <span key={badge} className="rounded-full bg-[#003087]/8 px-3 py-1 text-xs font-bold text-[#003087]">
              {badge}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-black text-[#003087]">{camp.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-relaxed text-slate-600">{camp.subtitle}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4 text-[#003087]" />{camp.city}</span>
          <span className="inline-flex items-center gap-1"><Users className="h-4 w-4 text-[#003087]" />גילאי {camp.ages}</span>
        </div>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#003087]">
          לפרטים נוספים והרשמה <ArrowLeft className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function buildCampCards(camps: CampRow[] | null) {
  if (!camps?.length) return FEATURED_FALLBACK;

  return camps.slice(0, 6).map((camp) => ({
    name: camp.slug === "mitgalgalim" ? "קייטנת מתגלגלים ונהנים" : camp.name,
    subtitle: camp.description || "פרטים מלאים על הקייטנה, גילאים, פעילות ואפשרויות הרשמה.",
    city: camp.city || "ערים נבחרות",
    ages: camp.age_min && camp.age_max ? `${camp.age_min}-${camp.age_max}` : "לפי הקייטנה",
    price: camp.price_basic ? `החל מ-${camp.price_basic.toLocaleString("he-IL")} ₪` : "פרטים בקייטנה",
    image: camp.image_url || HERO_IMG,
    href: `/kaytana/${camp.slug}`,
    badges: ["פרטים ברורים", "השארת פרטים", "בדיקת התאמה"],
  }));
}

export default async function HomePage() {
  const supabase = createClient();
  const { data: camps } = await supabase
    .from("camps")
    .select("id, name, slug, description, city, age_min, age_max, image_url, price_basic")
    .eq("is_active", true)
    .limit(6);

  const campCards = buildCampCards(camps as CampRow[] | null);

  return (
    <main className="overflow-x-hidden bg-white text-slate-900">
      <section className="relative bg-white">
        <div className="grid min-h-[620px] grid-cols-1 lg:grid-cols-2">
          <div className="order-2 relative min-h-[320px] overflow-hidden lg:order-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_IMG} alt="ילדים בפעילות קייטנה" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-white via-white/55 to-transparent lg:bg-gradient-to-r" />
          </div>

          <div className="order-1 flex flex-col items-center justify-center px-5 py-14 text-center lg:order-2 lg:px-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_IMG} alt="קייטנות" className="mb-5 h-24 w-auto object-contain md:h-28" />
            <h1 className="max-w-2xl text-3xl font-black leading-tight text-[#003087] md:text-5xl">
              מוצאים קייטנה שמתאימה לילדים שלכם
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
              משווים לפי עיר, גיל, סוג פעילות ותאריכים ומתקדמים להרשמה בצורה פשוטה וברורה.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 text-sm font-bold text-[#003087]">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#003087]/8 px-4 py-2"><CheckCircle className="h-4 w-4" />קייטנות פעילות</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#003087]/8 px-4 py-2"><TicketPercent className="h-4 w-4" />הטבות למשפחות</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#003087]/8 px-4 py-2"><ShieldCheck className="h-4 w-4" />מידע מסודר להורים</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-12 lg:-mt-16">
          <SearchPanel />
        </div>
      </section>

      <section className="bg-[#F5F7FA] px-4 py-16">
        <div className="container mx-auto">
          <SectionTitle
            eyebrow="קייטנות זמינות"
            title="הורים בוחרים קייטנה שמתאימה לילד, לא רק כזו שנראית יפה בפרסום"
            text="התחילו מהקייטנות שכבר זמינות באתר, בדקו התאמה והשאירו פרטים להמשך הרשמה."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {campCards.map((camp) => (
              <CampPreviewCard key={camp.name} camp={camp} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="container mx-auto">
          <SectionTitle
            eyebrow="סוגי קייטנות"
            title="כל משפחה מחפשת משהו קצת אחר"
            text="יש ילדים שרוצים לזוז כל היום, יש כאלה שאוהבים ליצור, ויש הורים שחייבים פתרון קרוב ונוח."
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {CATEGORY_CARDS.map(({ icon: Icon, title, text }) => (
              <Link key={title} href="/search" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#003087] text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black text-[#003087]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#003087] px-4 py-16 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-black text-[#F5C400]">למה קייטנות?</p>
              <h2 className="text-3xl font-black leading-tight md:text-4xl">פחות חיפוש מתיש, יותר החלטה בטוחה</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-blue-100">
                המטרה של האתר היא לתת להורים תמונה ברורה: מה יש באזור, למי זה מתאים, איך נרשמים ומה חשוב לבדוק לפני שמשלמים.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {TRUST_ITEMS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/15 bg-white/10 p-5">
                  <Icon className="mb-4 h-7 w-7 text-[#F5C400]" />
                  <h3 className="font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-blue-100">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F7FA] px-4 py-16">
        <div className="container mx-auto">
          <SectionTitle
            eyebrow="הטבות למשפחות"
            title="יכול להיות שמגיעה לכם הנחה דרך מקום העבודה"
            text="אנחנו מרכזים קייטנות שעובדות עם חברות, ארגונים וועדי עובדים. בשלב הראשון הבירור מתבצע בוואטסאפ בצורה מהירה."
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
            {PARTNER_LOGOS.map((logo) => (
              <div key={logo.alt} className="flex h-20 items-center justify-center rounded-xl border border-slate-200 bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={logo.alt} className="max-h-12 max-w-full object-contain" />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href={WHATSAPP_URL} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5C400] px-7 py-4 font-black text-[#003087] transition hover:bg-[#e0b200]">
              <MessageCircle className="h-5 w-5" />
              לבירור זכאות ואופן הרשמה
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="container mx-auto">
          <SectionTitle eyebrow="איך זה עובד" title="שלושה צעדים פשוטים עד קייטנה מתאימה" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="text-4xl font-black text-[#F5C400]">{item.step}</span>
                <h3 className="mt-4 text-xl font-black text-[#003087]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F7FA] px-4 py-16">
        <div className="container mx-auto grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="מדריכים להורים" title="לפני שנרשמים, כדאי לדעת מה לבדוק" />
            <div className="space-y-3">
              {BLOG_POSTS.map((post) => (
                <Link key={post.href} href={post.href} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 font-bold text-[#003087] transition hover:border-[#003087]">
                  {post.title}
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <SectionTitle eyebrow="שאלות נפוצות" title="התשובות שהורים מחפשים לפני הרשמה" />
            <div className="space-y-3">
              {FAQ.map((item) => (
                <details key={item.q} className="group rounded-xl border border-slate-200 bg-white p-4">
                  <summary className="cursor-pointer list-none font-black text-[#003087]">{item.q}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="container mx-auto rounded-2xl bg-[#003087] px-6 py-12 text-center text-white md:px-12">
          <p className="mb-3 text-sm font-black text-[#F5C400]">לא מצאתם התאמה מדויקת?</p>
          <h2 className="text-3xl font-black md:text-4xl">נכוון אתכם לקייטנה שמתאימה לילדים שלכם</h2>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100">שלחו לנו עיר, גיל וסוג פעילות שמעניין אתכם ונחזור עם אפשרויות רלוונטיות.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={WHATSAPP_URL} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5C400] px-7 py-4 font-black text-[#003087] transition hover:bg-[#e0b200]">
              <MessageCircle className="h-5 w-5" />
              שלחו הודעה בוואטסאפ
            </Link>
            <Link href="/search" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-7 py-4 font-black text-white transition hover:bg-white/10">
              <Search className="h-5 w-5" />
              המשיכו לחיפוש
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
