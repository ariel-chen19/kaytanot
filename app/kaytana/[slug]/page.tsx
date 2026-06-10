export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  MapPin,
  Users,
  Calendar,
  MessageCircle,
  CheckCircle,
  ArrowLeft,
  Shield,
  Bus,
  Utensils,
  UtensilsCrossed,
  Award,
  Waves,
  Trees,
  Target,
  Music2,
  FileText,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import CyclesAndPricing from "@/components/CyclesAndPricing";
import ActivitiesGallery from "@/components/ActivitiesGallery";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import FaqAccordion from "@/components/FaqAccordion";
import ExperienceGalleryCarousel from "@/components/ExperienceGalleryCarousel";
import type { Metadata } from "next";

interface Cycle {
  label: string;
  dates: string;
  days: string;
  hours: string;
}

interface FaqItem {
  q: string;
  a: string;
  links?: { label: string; href?: string }[];
}

interface Feature {
  type: string;
  label: string;
  desc: string;
}

interface CityPrice {
  city: string;
  price: number;
}

interface Testimonial {
  name: string;
  city: string;
  text: string;
}

interface ActivityGalleryItem {
  name: string;
  image: string;
}

interface DayScheduleItem {
  time: string;
  title: string;
  icon: React.ElementType;
}

interface ExperienceGalleryItem {
  image: string;
  alt: string;
}

interface CampReview {
  id: string;
  source: "google" | "site";
  author_name: string;
  author_city: string | null;
  rating: number;
  review_text: string;
  review_date: string | null;
  review_url: string | null;
}

interface CampSocialProof {
  id: string;
  proof_type: "google_review" | "manual_text" | "image_testimonial";
  source: "google" | "site" | "whatsapp" | "other";
  author_name: string | null;
  author_city: string | null;
  rating: number | null;
  body_text: string | null;
  image_url: string | null;
  review_date: string | null;
  source_label: string | null;
  source_url: string | null;
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

const FEATURE_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  safety: { icon: Shield, color: "text-blue-600" },
  transport: { icon: Bus, color: "text-orange-500" },
  food: { icon: UtensilsCrossed, color: "text-green-600" },
  ratio: { icon: Users, color: "text-purple-600" },
  experience: { icon: Award, color: "text-yellow-500" },
  pool: { icon: Waves, color: "text-cyan-600" },
  sport: { icon: Target, color: "text-red-600" },
  art: { icon: Music2, color: "text-pink-600" },
  nature: { icon: Trees, color: "text-green-700" },
  personal: { icon: CheckCircle, color: "text-blue-500" },
};

const MITGALGALIM_CITY_PRICES: CityPrice[] = [
  { city: "נתניה", price: 2790 },
  { city: "כפר יונה", price: 2790 },
  { city: "יישובי לב השרון (קדימה, צורן, אבן יהודה, תל מונד)", price: 2790 },
  { city: "תל אביב", price: 2790 },
  { city: "ראש העין", price: 2690 },
  { city: "פתח תקווה", price: 2690 },
  { city: "קריית אונו", price: 2690 },
  { city: "רמת גן", price: 2690 },
  { city: "גבעתיים", price: 2690 },
  { city: "אזור", price: 2690 },
  { city: "חולון", price: 2690 },
  { city: "בת ים", price: 2690 },
  { city: "ראשון לציון", price: 2690 },
  { city: "נס ציונה", price: 2690 },
  { city: "רמלה", price: 2690 },
  { city: "באר יעקב", price: 2690 },
  { city: "מ.א גן רווה", price: 2690 },
  { city: "רחובות", price: 2690 },
  { city: "יבנה", price: 2690 },
  { city: "אשדוד", price: 2690 },
  { city: "אשקלון", price: 2690 },
  { city: "גן יבנה", price: 2690 },
];

const MITGALGALIM_DEPARTURE_CITIES = [
  "נתניה",
  "כפר יונה",
  "יישובי לב השרון (קדימה, צורן, אבן יהודה, תל מונד)",
  "תל אביב",
  "רמת גן",
  "גבעתיים",
  "חולון",
  "בת ים",
  "ראשון לציון",
  "מ.א. גן רווה",
  "רחובות",
  "נס ציונה",
  "באר יעקב",
  "רמלה (נאות שמיר)",
  "יבנה",
  "אשדוד",
  "אשקלון",
  "ראש העין",
  "פתח תקווה",
];

const MITGALGALIM_TESTIMONIALS: Testimonial[] = [
  {
    name: "אמא של נועם",
    city: "ראשון לציון",
    text: "הרגשנו שיש עם מי לדבר מהרגע הראשון. התוכנית ברורה, ההסעות מסודרות, והילד חזר כל יום עם חיוך ענק.",
  },
  {
    name: "אבא של יעל",
    city: "רמת גן",
    text: "מה שהכי הרשים אותנו היה הסדר והארגון. עדכונים ברורים, צוות מקסים, והמון שקט נפשי כהורים.",
  },
  {
    name: "אמא של תומר",
    city: "נתניה",
    text: "השילוב בין אטרקציות מעולות ליחס אישי באמת מורגש. זאת לא עוד קייטנה רגילה, אלא חוויה שלמה.",
  },
];

const MITGALGALIM_ASSET_VERSION = "20260603";

const MITGALGALIM_ACTIVITIES_GALLERY: ActivityGalleryItem[] = [
  { name: "ימי בריכה מוצללת", image: `/mitgalgalim/brikha-kaytana.webp?v=${MITGALGALIM_ASSET_VERSION}` },
  { name: "פארק מתנפחים", image: `/mitgalgalim/mishtanim-kaytana.webp?v=${MITGALGALIM_ASSET_VERSION}` },
  { name: "לונה פארק / סופרלנד", image: `/mitgalgalim/luna-park-kaytana.webp?v=${MITGALGALIM_ASSET_VERSION}` },
  { name: "חוויה קולנועית", image: `/mitgalgalim/kolnoah-kaytana.webp?v=${MITGALGALIM_ASSET_VERSION}` },
  { name: "יום ספורט", image: `/mitgalgalim/kaduregel-kaytana.webp?v=${MITGALGALIM_ASSET_VERSION}` },
  { name: "באולינג", image: `/mitgalgalim/bowling-kaytana.webp?v=${MITGALGALIM_ASSET_VERSION}` },
  { name: "פארק מים", image: `/mitgalgalim/park-maim-kaytana.webp?v=${MITGALGALIM_ASSET_VERSION}` },
  { name: "שייט בסירות", image: `/mitgalgalim/shayit-siraot-kaytana.webp?v=${MITGALGALIM_ASSET_VERSION}` },
  { name: "גן חיות", image: `/mitgalgalim/gan-hayot-kaytana.webp?v=${MITGALGALIM_ASSET_VERSION}` },
  { name: "מופעי אמנים", image: `/mitgalgalim/mofaa-omanim-kaytana.webp?v=${MITGALGALIM_ASSET_VERSION}` },
];

const MITGALGALIM_WHATSAPP_REVIEWS: CampSocialProof[] = Array.from({ length: 6 }, (_, index) => ({
  id: `mitgalgalim-whatsapp-review-${index + 1}`,
  proof_type: "image_testimonial",
  source: "whatsapp",
  author_name: `המלצת הורה ${index + 1}`,
  author_city: null,
  rating: 5,
  body_text: null,
  image_url: `/mitgalgalim/mitgalgalim-review${index + 1}.webp?v=${MITGALGALIM_ASSET_VERSION}`,
  review_date: null,
  source_label: "WhatsApp",
  source_url: null,
}));

const MITGALGALIM_DAY_SCHEDULE: DayScheduleItem[] = [
  { time: "07:30-08:00", title: "איסוף", icon: Bus },
  { time: "08:30", title: "הגעה לאתר האטרקציה", icon: MapPin },
  { time: "08:30-10:00", title: "בילוי באתר האטרקציה", icon: Waves },
  { time: "10:00-10:30", title: "ארוחת בוקר", icon: Utensils },
  { time: "10:30-13:00", title: "המשך בילוי באתר האטרקציה", icon: Award },
  { time: "13:00-13:30", title: "פיזור בתחנות איסוף", icon: Users },
];

const MITGALGALIM_EXPERIENCE_GALLERY: ExperienceGalleryItem[] = Array.from({ length: 8 }, (_, index) => ({
  image: `/mitgalgalim/mitgalgalim%20gallery${index + 1}.webp?v=${MITGALGALIM_ASSET_VERSION}`,
  alt: `הצצה לחוויות מהקייטנה ${index + 1}`,
}));

const MITGALGALIM_EXTRA_FAQ_ITEMS: FaqItem[] = [
  {
    q: "חלוקה לפי אפיון גיל",
    a: "הילדים מחולקים לקבוצות גיל מותאמות. בדרך כלל מדריך או מדריכה מלווים קבוצה של כ-10 עד 15 ילדים, כדי לשמור על יחס אישי, סדר ובטיחות לאורך היום.",
  },
  {
    q: "צוות ההדרכה שלנו",
    a: "צוות ההדרכה מורכב ממורים, סטודנטים ומד\"צים מגיל 16 בעלי תעודת הדרכה. כולם עוברים את ההכשרה שלנו.",
  },
  {
    q: "קשר עם צוות הקייטנה",
    a: "לפני פתיחת הקייטנה נפתחת קבוצת וואטסאפ להורים. במהלך הקייטנה נשלחים עדכונים, תזכורות, מידע לגבי היום הבא ותמונות מהפעילויות. ניתן לפנות לצוות הקייטנה גם באופן אישי.",
  },
  {
    q: "מזון",
    a: "הילדים מביאים ארוחת בוקר מהבית. הקייטנה פועלת בהתאם להנחיות משרד הבריאות, ובמהלך היום יש הקפדה על שתיית מים מסודרת.",
  },
  {
    q: "משמעת מים",
    a: "בכל שעה עגולה מתבצעת בדיקה שהילדים שותים מים. הילדים שותים מול המדריכים כדי לוודא שכולם שומרים על שתייה מספקת לאורך היום.",
  },
  {
    q: "איך מתבצע האיסוף והפיזור לקייטנה?",
    a: "בעת ההרשמה יש לציין את בית הספר או נקודת האיסוף הקרובה למקום המגורים. לפני פתיחת הקייטנה יועברו נקודות האיסוף והשעות המדויקות, והפיזור מתבצע בהתאם לנקודות שנקבעו.",
  },
  {
    q: "האם יש הנחות?",
    a: "אנו עובדים עם ועדי עובדים, מועדונים, ארגונים והחברות הגדולות במשק בהסדרים ומחירים מסובסדים ומוזלים לעובדים. כמו כן ניתן לקבל הנחה בהרשמה קבוצתית (מעל 5 ילדים).",
  },
  {
    q: "מה קורה אם לא ניתן יהיה לקיים את הקייטנה בשל מצב ביטחוני או מלחמה?",
    a: "במקרה של שינוי ביטחוני או הנחיות רשמיות, נפעל לפי הנחיות הרשויות ונעדכן את ההורים בהקדם האפשרי לגבי המשך הפעילות, דחייה או פתרון מתאים.",
  },
  {
    q: "תקנון, טפסים ואישורים",
    a: "כאן מרוכזים מסמכי הקייטנה, התקנון והאישורים הרלוונטיים לעיון ההורים.",
    links: [
      {
        label: "תקנון",
        href: "https://www.kaytana.net/wp-content/uploads/2026/04/%D7%9E%D7%AA%D7%92%D7%9C%D7%92%D7%9C%D7%99%D7%9D-%D7%95%D7%A0%D7%94%D7%A0%D7%99%D7%9D-%D7%95%D7%95%D7%A8%D7%93-2026-%D7%AA%D7%A7%D7%A0%D7%95%D7%9F-%D7%A7%D7%99%D7%99%D7%98%D7%A0%D7%94.pdf",
      },
      { label: "אישור משרד החינוך" },
      {
        label: "ביטוח 2026",
        href: "https://www.kaytana.net/wp-content/uploads/2026/06/%EF%BF%BD%EF%BF%BD%D7%90%D7%99%D7%A9%D7%95%D7%A8-%D7%91%D7%99%D7%98%D7%95%D7%97-%D7%9C%D7%90%D7%AA%D7%A8%EF%BF%BD.pdf",
      },
    ],
  },
];

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("camps")
    .select("name,description,city,slug,image_url,logo_url,age_min,age_max,price_basic")
    .eq("slug", params.slug)
    .single();

  if (!data) return {};

  if (params.slug === "mitgalgalim") {
    const title = "קייטנת מתגלגלים ונהנים - קייטנת אטרקציות עם הסעות מבית הספר";
    const description =
      "קייטנת מתגלגלים ונהנים לילדים בגילאי 6-13: 27+ שנות ניסיון, צוות הדרכה מקצועי, הסעות מבית הספר הקרוב לבית ואטרקציות מובילות בכל יום.";
    const image = data.image_url || data.logo_url || "/mitgalgalim/mitgalgalim.webp";

    return {
      title,
      description,
      keywords: [
        "קייטנת מתגלגלים ונהנים",
        "קייטנת אטרקציות",
        "קייטנה עם הסעות",
        "קייטנת קיץ 2026",
        "קייטנה לילדים",
        "סופרלנד",
        "לונה פארק",
        "קייטנה עם בריכה",
      ],
      alternates: {
        canonical: `/kaytana/${data.slug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "he_IL",
        url: `/kaytana/${data.slug}`,
        images: [{ url: image, alt: "קייטנת מתגלגלים ונהנים" }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  }

  return {
    title: `${data.name} - קייטנות`,
    description: data.description?.slice(0, 155) ?? `קייטנה ב${data.city}`,
    alternates: {
      canonical: `/kaytana/${data.slug}`,
    },
    openGraph: {
      title: `${data.name} - קייטנות`,
      description: data.description?.slice(0, 155) ?? `קייטנה ב${data.city}`,
      type: "website",
      locale: "he_IL",
      url: `/kaytana/${data.slug}`,
      images: data.image_url ? [{ url: data.image_url, alt: data.name }] : undefined,
    },
  };
}

export default async function KaytanaPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data: camp } = await supabase
    .from("camps")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!camp) notFound();

  const c = camp as Camp;
  const { data: socialProofsData } = await supabase
    .from("camp_social_proofs")
    .select("id, proof_type, source, author_name, author_city, rating, body_text, image_url, review_date, source_label, source_url")
    .eq("camp_id", c.id)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .order("review_date", { ascending: false })
    .limit(12);

  const { data: reviewsData } = await supabase
    .from("camp_reviews")
    .select("id, source, author_name, author_city, rating, review_text, review_date, review_url")
    .eq("camp_id", c.id)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .order("review_date", { ascending: false })
    .limit(8);

  if (c.features && typeof c.features === "string") c.features = JSON.parse(c.features);
  if (c.cycles && typeof c.cycles === "string") c.cycles = JSON.parse(c.cycles);
  if (c.cities && typeof c.cities === "string") c.cities = JSON.parse(c.cities);
  if (c.faq && typeof c.faq === "string") c.faq = JSON.parse(c.faq);
  if (c.city_prices && typeof c.city_prices === "string") c.city_prices = JSON.parse(c.city_prices);
  if (c.why_us && typeof c.why_us === "string") c.why_us = JSON.parse(c.why_us);
  if (c.activities_gallery && typeof c.activities_gallery === "string") c.activities_gallery = JSON.parse(c.activities_gallery);

  const cityPrices = c.slug === "mitgalgalim" ? MITGALGALIM_CITY_PRICES : c.city_prices ?? [];
  const cityCount = c.slug === "mitgalgalim" ? 23 : c.cities?.length ?? 0;
  const cycleCount = c.cycles?.length ?? 0;
  const ageLabel = c.slug === "mitgalgalim" ? "גילאי 6-13" : `גילאי ${c.age_min}-${c.age_max}`;
  const seasonLabel = c.slug === "mitgalgalim" ? "קיץ 2026" : cycleCount === 1 ? c.cycles![0].dates : `${cycleCount} מחזורים`;
  const cityLabel = c.slug === "mitgalgalim" ? "23 ערים ברחבי הארץ" : `${cityCount} ערים ברחבי הארץ`;
  const displayPrice = c.slug === "mitgalgalim" ? Math.min(...cityPrices.map((item) => item.price)) : c.price_basic;
  const displayPriceLabel =
    c.slug === "mitgalgalim"
      ? `${Math.min(...cityPrices.map((item) => item.price)).toLocaleString("he-IL")}–${Math.max(
          ...cityPrices.map((item) => item.price),
        ).toLocaleString("he-IL")} ₪`
      : displayPrice
        ? `${displayPrice.toLocaleString("he-IL")} ₪`
        : null;
  const heroImageUrl = c.slug === "mitgalgalim"
    ? `/mitgalgalim/mitgalgalim.webp?v=${MITGALGALIM_ASSET_VERSION}`
    : c.image_url ?? "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=80";
  const logoUrl = c.slug === "mitgalgalim"
    ? `/mitgalgalim/mitgalgalim-logo.webp?v=${MITGALGALIM_ASSET_VERSION}`
    : c.logo_url ?? "/kaytanot_logo.webp";
  const leadFormTitle = c.slug === "mitgalgalim" ? "השאירו פרטים לקבלת מידע נוסף" : "בדיקת מקום פנוי";
  const whatsappPhone = c.slug === "mitgalgalim" ? "972559999139" : c.whatsapp ?? "972559999139";
  const displayWhyUs = c.slug === "mitgalgalim"
    ? [
        "ניסיון של 27+ שנים",
        "מובילים בתחום הקייטנות",
        "צוות מקצועי, מסור ובעל הכשרה מלאה",
        "ליווי, סדר וארגון ברמה הגבוהה ביותר",
        "כל יום אטרקציה חדשה וחוויה אחרת",
        "יחס אישי לכל ילד וילדה",
        "הסעות נוחות ומאובטחות מ-23 ערים",
      ]
    : c.why_us ?? [];
  const displayActivitiesGallery = c.slug === "mitgalgalim" ? MITGALGALIM_ACTIVITIES_GALLERY : c.activities_gallery ?? [];
  const displaySocialProofs: CampSocialProof[] =
    c.slug === "mitgalgalim"
      ? MITGALGALIM_WHATSAPP_REVIEWS
      : socialProofsData && socialProofsData.length > 0
      ? (socialProofsData as CampSocialProof[])
      : reviewsData && reviewsData.length > 0
        ? (reviewsData as CampReview[]).map((item) => ({
            id: item.id,
            proof_type: item.source === "google" ? "google_review" : "manual_text",
            source: item.source,
            author_name: item.author_name,
            author_city: item.author_city,
            rating: item.rating,
            body_text: item.review_text,
            image_url: null,
            review_date: item.review_date,
            source_label: item.source === "google" ? "Google Reviews" : "המלצה באתר",
            source_url: item.review_url,
          }))
        : c.slug === "mitgalgalim"
          ? MITGALGALIM_TESTIMONIALS.map((item, index) => ({
              id: `fallback-${index}`,
              proof_type: "google_review" as const,
              source: "google" as const,
              author_name: item.name,
              author_city: item.city,
              rating: 5,
              body_text: item.text,
              image_url: null,
              review_date: null,
              source_label: "Google Reviews",
              source_url: null,
            }))
          : [];
  const googleReviewCount = displaySocialProofs.filter((item) => item.source === "google").length;
  const hasMixedSocialProofs = displaySocialProofs.some((item) => item.source !== "google");
  const socialProofSummaryTitle = c.slug === "mitgalgalim" ? "ביקורות מוואטסאפ" : "המלצות הורים";
  const nonGoogleProofCount = displaySocialProofs.length - googleReviewCount;
  const nonGoogleProofLabel = nonGoogleProofCount === 1 ? "המלצה אחת" : `${nonGoogleProofCount} המלצות`;
  const socialProofSummaryText =
    c.slug === "mitgalgalim"
      ? `${displaySocialProofs.length} צילומי מסך של הורים`
      : googleReviewCount > 0 && hasMixedSocialProofs
      ? `${googleReviewCount} ביקורות גוגל + ${nonGoogleProofLabel}`
      : googleReviewCount > 0
        ? `${googleReviewCount}+ ביקורות גוגל נבחרות`
        : `${displaySocialProofs.length}+ המלצות נבחרות`;
  const averageRating =
    displaySocialProofs.filter((item) => item.rating !== null).length > 0
      ? (
          displaySocialProofs.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
          displaySocialProofs.filter((item) => item.rating !== null).length
        ).toFixed(1)
      : null;
  const displayFaq = c.slug === "mitgalgalim" ? MITGALGALIM_EXTRA_FAQ_ITEMS : c.faq ?? [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kaytanot.co.il";
  const pageUrl = `${siteUrl}/kaytana/${c.slug}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ChildCare",
      name: c.slug === "mitgalgalim" ? "קייטנת מתגלגלים ונהנים" : c.name,
      description:
        c.slug === "mitgalgalim"
          ? "קייטנת אטרקציות עם הסעות מבית הספר הקרוב לבית, 27+ שנות ניסיון וצוות הדרכה מקצועי."
          : c.description ?? `קייטנה ב${c.city}`,
      url: pageUrl,
      image: heroImageUrl,
      logo: logoUrl,
      areaServed: c.slug === "mitgalgalim" ? "ישראל" : c.city,
      priceRange: displayPriceLabel ?? undefined,
      audience: {
        "@type": "PeopleAudience",
        suggestedMinAge: c.age_min,
        suggestedMaxAge: c.age_max,
      },
    },
    ...(displayFaq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: displayFaq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="px-4 pt-4">
        {c.slug === "mitgalgalim" && (
          <h1 className="sr-only">קייטנת מתגלגלים ונהנים - קייטנת אטרקציות עם הסעות מבית הספר הקרוב לבית</h1>
        )}
        <div className="mx-auto w-full max-w-[1880px] overflow-hidden rounded-[28px] border border-[#dfe7f2] bg-white shadow-xl shadow-[#003087]/10">
          <div className="flex flex-col md:flex-row-reverse">
            {c.slug === "mitgalgalim" && (
              <div className="flex flex-col items-center px-6 pb-3 pt-6 text-center md:hidden">
                <img src={logoUrl} alt={c.name} className="mb-1.5 h-24 max-w-[280px] object-contain" />
                <p className="mb-0.5 font-rubik text-3xl font-black leading-none text-[#182e86]">
                  קייטנת
                </p>
                <p className="mb-1.5 font-rubik text-4xl font-black leading-[0.95] text-[#182e86]">
                  {c.name}
                </p>
                <p className="max-w-xs text-base font-semibold leading-7 text-slate-700">
                  כל האטרקציות המובילות בארץ
                </p>
                <div className="mt-2 h-1 w-14 rounded-full bg-[#F5C400]" />
              </div>
            )}

            <div className="relative h-[300px] w-full md:h-[585px] md:w-[55%]">
              <img src={heroImageUrl} alt={c.name} className="h-full w-full object-cover object-left" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003087]/25 via-transparent to-transparent md:hidden" />
              <div className="absolute inset-y-0 right-0 hidden w-[40%] bg-gradient-to-l from-white via-white/40 to-transparent md:block" />
              <div className="absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-white to-transparent md:block" />
            </div>

            <div className="flex w-full flex-col items-center justify-center px-8 py-8 text-center md:w-[45%] md:px-12 md:py-10 lg:px-16">
              <div className={c.slug === "mitgalgalim" ? "hidden md:block" : ""}>
                <img src={logoUrl} alt={c.name} className="mx-auto mb-1.5 h-28 max-w-[340px] object-contain" />

                <p className="mb-0.5 font-rubik text-4xl font-black leading-none text-[#182e86] md:text-5xl lg:text-[52px]">
                  קייטנת
                </p>
                {c.slug === "mitgalgalim" ? (
                  <p className="mb-1.5 font-rubik text-4xl font-black leading-[0.95] text-[#182e86] md:text-5xl lg:text-[52px]">
                    {c.name}
                  </p>
                ) : (
                  <h1 className="mb-1.5 font-rubik text-4xl font-black leading-[0.95] text-[#182e86] md:text-5xl lg:text-[52px]">
                    {c.name}
                  </h1>
                )}

                <p className="mb-0.5 max-w-xl self-center text-lg leading-relaxed text-slate-700">
                  {c.slug === "mitgalgalim"
                    ? "כל האטרקציות המובילות בארץ"
                    : c.tagline ??
                      (c.activities?.length
                        ? "כל יום אטרקציה חדשה והרפתקה אחרת!"
                        : `קייטנה לגילאי ${c.age_min}-${c.age_max}`)}
                </p>
                <div className="mx-auto mb-2.5 h-1 w-14 rounded-full bg-[#F5C400]" />
              </div>

              <div className="mb-2.5 grid w-full grid-cols-1 gap-2 text-[15px] text-slate-800 sm:grid-cols-3">
                <div className="flex items-center justify-center gap-2 rounded-xl border border-[#dfe7f2] bg-[#f6f8fc] px-3 py-1.5">
                  <Users className="h-4 w-4 text-[#182e86]" />
                  <span>{ageLabel}</span>
                </div>
                {cycleCount > 0 && (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-[#dfe7f2] bg-[#f6f8fc] px-3 py-1.5">
                    <Calendar className="h-4 w-4 text-[#182e86]" />
                    <span>{seasonLabel}</span>
                  </div>
                )}
                {cityCount > 0 && (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-[#dfe7f2] bg-[#f6f8fc] px-3 py-1.5">
                    <MapPin className="h-4 w-4 text-[#182e86]" />
                    <span>{cityLabel}</span>
                  </div>
                )}
              </div>

              {displayPrice && (
                <div className="mb-2.5">
                  <p className="font-heebo text-4xl font-black leading-none text-[#182e86]">
                    {displayPriceLabel}
                  </p>
                </div>
              )}

              <p className="mb-2.5 text-base font-bold text-slate-600">
                מחירים מיוחדים והטבות דרך חברות, ארגונים וועדי עובדים
              </p>

              <a
                href="#contact-form-bottom"
                className="inline-flex w-full max-w-xs items-center justify-center gap-3 self-center rounded-2xl bg-[#F5C400] px-7 py-2.5 text-base font-black text-[#182e86] shadow-lg shadow-[#F5C400]/30 transition-all hover:bg-[#e0b200]"
              >
                <ArrowLeft className="h-5 w-5" />
                לפרטים נוספים והרשמה
              </a>
            </div>

          </div>
        </div>
      </section>

      {c.features && Array.isArray(c.features) && c.features.length > 0 && (
        <section className="relative z-10 px-4 pb-4 pt-8">
          <div className="mx-auto w-full max-w-[1560px]">
            <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-[#dfe7f2] bg-white shadow-xl shadow-[#003087]/10 md:grid-cols-5">
              {c.features.slice(0, 5).map((feat, i) => {
                const iconDef = FEATURE_ICONS[feat.type] ?? { icon: CheckCircle, color: "text-[#182e86]" };
                const Icon = iconDef.icon;
                const label =
                  c.slug === "mitgalgalim" && feat.type === "transport"
                    ? "פריסה ארצית"
                    : c.slug === "mitgalgalim" && feat.type === "ratio"
                      ? "יחס מדריכים"
                      : feat.label;
                const description =
                  c.slug === "mitgalgalim" && feat.type === "transport"
                    ? "23 ערים ברחבי הארץ"
                    : c.slug === "mitgalgalim" && feat.type === "ratio"
                      ? "יחס מדריכים עד 1:15"
                      : c.slug === "mitgalgalim" && feat.type === "experience"
                        ? "מובילים בתחום הקייטנות"
                      : feat.desc;

                return (
                  <div
                    key={i}
                    className="flex min-h-24 flex-col items-center justify-center gap-1.5 border-b border-l border-[#edf1f7] px-3 py-4 text-center last:border-l-0 md:min-h-32 md:gap-2 md:border-b-0 md:px-4 md:py-6"
                  >
                    <Icon className={`h-7 w-7 md:h-8 md:w-8 ${iconDef.color}`} />
                    <p className="font-heebo text-lg font-black leading-tight text-[#182e86] md:text-xl">{label}</p>
                    {description && <p className="text-sm leading-5 text-slate-950 md:text-base md:leading-6">{description}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <main className="px-4 pb-10 pt-4">
        <div className="mx-auto w-full max-w-[1560px] space-y-8">
          {c.description && (
            <section className="rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-1 font-heebo text-3xl font-black text-[#182e86]">
                על הקייטנה
              </h2>
              <div className="mb-5 h-1 w-10 rounded-full bg-[#F5C400]" />
              <p className="whitespace-pre-wrap text-lg leading-8 text-slate-900">
                {c.slug === "mitgalgalim"
                  ? "קייטנת מתגלגלים ונהנים פועלת כבר 27+ שנים.\nבכל יום אנו אוספים את הילדים מבית הספר הקרוב לבית ונוסעים לחוויה באטרקציה אחרת: בריכות, לונה פארק / סופרלנד, שייט, גן חיות, קולנוע, באולינג, מתחם ענק של מתנפחים ועוד הרבה חוויות.\nהקייטנה מופעלת על ידי מפעלי קיץ - קייטנות, מחנות, צהרונים והפקות בפריסה ארצית, בניהולו של ניר מאור, בוגר וינגייט ומאמן בכיר מוסמך. מאחורי הפעילות עומדות עשרות שנות ניסיון בעבודה עם ילדים, קייטנות ומחנות עבור מוסדות, ארגונים וחברות.\nאנחנו משלבים חוויה גדולה עם ארגון מקצועי, בטיחות, יחס אישי וצוות הדרכה מנוסה שמלווה את הילדים לאורך כל היום.\nאנחנו דוגלים במשפט: בקיץ הזה ההורים נחים והילדים מחייכים!"
                  : c.description}
              </p>
            </section>
          )}

          {displayActivitiesGallery.length > 0 && (
            <section className="rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-1 font-heebo text-3xl font-black text-[#182e86]">
                {c.slug === "mitgalgalim" ? "חלק מהאטרקציות שמחכות לילדים" : "מה עושים בקייטנה?"}
              </h2>
              <div className="mb-3 h-1 w-10 rounded-full bg-[#F5C400]" />
              {c.slug === "mitgalgalim" && (
                <p className="mb-6 max-w-3xl text-base leading-7 text-slate-700">
                  בכל יום אוספים את הילדים מבית הספר הקרוב לבית ויוצאים לחוויה באטרקציה אחרת:
                </p>
              )}
              <ActivitiesGallery items={displayActivitiesGallery} />
              {c.slug === "mitgalgalim" && (
                <p className="mt-4 text-sm font-semibold text-slate-500">
                  *האטרקציות משתנות לפי עיר ולפי מחזור
                </p>
              )}

              {c.slug === "mitgalgalim" && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <a
                    href="/mitgalgalim/mitgalgalim%20m1.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#182e86]/15 bg-[#182e86] px-5 py-3.5 text-base font-black text-white shadow-sm transition-colors hover:bg-[#111f5c]"
                  >
                    <FileText className="h-5 w-5" />
                    תוכנית מחזור 1
                  </a>
                  <a
                    href="/mitgalgalim/mitgalgalim%20m2.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#F5C400]/40 bg-[#F5C400] px-5 py-3.5 text-base font-black text-[#182e86] shadow-sm transition-colors hover:bg-[#e0b200]"
                  >
                    <FileText className="h-5 w-5" />
                    תוכנית מחזור 2
                  </a>
                </div>
              )}
            </section>
          )}

          {c.slug === "mitgalgalim" && (
            <section className="rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-1 font-heebo text-3xl font-black text-[#182e86]">
                הקייטנה יוצאת מערים:
              </h2>
              <div className="mb-5 h-1 w-10 rounded-full bg-[#F5C400]" />
              <div className="flex flex-wrap gap-2.5">
                {MITGALGALIM_DEPARTURE_CITIES.map((city) => (
                  <span
                    key={city}
                    className="rounded-full border border-[#dfe7f2] bg-[#f6f8fc] px-4 py-2 text-sm font-bold text-[#182e86]"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </section>
          )}

          {displayWhyUs.length > 0 && (
            <section className="rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-1 font-heebo text-3xl font-black text-[#182e86]">למה לבחור דווקא בנו?</h2>
              <div className="mb-6 h-1 w-10 rounded-full bg-[#F5C400]" />
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {displayWhyUs.slice(0, 10).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#182e86]">
                      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold leading-7 text-slate-950">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {displaySocialProofs.length > 0 && (
            <section className="rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:p-8">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="mb-1 font-heebo text-3xl font-black text-[#182e86]">
                    {c.slug === "mitgalgalim" ? "הורים כתבו לצוות שלנו" : "מה הורים אומרים"}
                  </h2>
                  <div className="mb-3 h-1 w-10 rounded-full bg-[#F5C400]" />
                  <p className="max-w-2xl text-base leading-7 text-slate-700">
                    {c.slug === "mitgalgalim"
                      ? "צילומי מסך אמיתיים מהורים שמספרים על החוויה, הצוות, ההסעות והתחושה לאורך הקייטנה."
                      : "הורים שכבר היו שם מספרים הכי טוב איך נראית החוויה בפועל: סדר, צוות, אטרקציות, הסעות ותחושת ביטחון לאורך כל היום."}
                  </p>
                </div>
                {c.slug !== "mitgalgalim" && (
                  <div className="flex min-w-[260px] items-center gap-4 self-start rounded-2xl border border-[#dfe7f2] bg-white px-4 py-3 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8fbff] text-[#182e86]">
                      <Users className="h-7 w-7" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{socialProofSummaryTitle}</span>
                      <div className="flex items-center gap-2 text-[#182e86]">
                        <span className="text-sm font-bold">{averageRating ? `${averageRating}/5` : "ביקורות"}</span>
                        <span className="text-base tracking-[0.18em] text-[#F5C400]">★★★★★</span>
                      </div>
                      <span className="text-xs text-slate-600">{socialProofSummaryText}</span>
                    </div>
                  </div>
                )}
              </div>

              <ReviewsCarousel items={displaySocialProofs.slice(0, 8)} />
            </section>
          )}

          {c.slug === "mitgalgalim" && (
            <section className="rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:p-8">
              <div className="mb-8 text-right">
                <h2 className="mb-1 font-heebo text-3xl font-black text-[#182e86]">איך נראה יום בקייטנה?</h2>
                <div className="mb-3 h-1 w-10 rounded-full bg-[#F5C400]" />
                <p className="max-w-2xl text-base leading-7 text-slate-700">
                  בכל יום יוצאים לאטרקציה אחרת, אבל המסגרת היומית נשארת ברורה ומסודרת.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-6 md:gap-2">
                {MITGALGALIM_DAY_SCHEDULE.map((item, index) => {
                  const Icon = item.icon;
                  const isLast = index === MITGALGALIM_DAY_SCHEDULE.length - 1;

                  return (
                    <div key={item.time} className="relative">
                      <div className="flex items-center gap-3 rounded-2xl border border-[#edf1f7] bg-[#fbfdff] px-4 py-3 text-right shadow-sm md:flex-col md:gap-0 md:border-0 md:bg-transparent md:px-2 md:py-4 md:text-center md:shadow-none">
                        <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#f4f0ff] text-[#6d42d8] shadow-sm md:mb-3 md:h-14 md:w-14">
                          <Icon className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <div>
                          <p className="mb-1 text-sm font-black text-[#182e86]">{item.time}</p>
                          <p className="text-sm font-bold leading-5 text-slate-800">{item.title}</p>
                        </div>
                      </div>

                      {!isLast && (
                        <>
                          <ArrowLeft className="absolute left-[-12px] top-7 z-10 hidden h-5 w-5 text-[#6d42d8]/70 md:block" />
                          <ArrowLeft className="mx-auto my-1 h-5 w-5 -rotate-90 text-[#6d42d8]/70 md:hidden" />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 space-y-1 text-sm font-semibold text-slate-500">
                <p>כל שעה עגולה בדיקה שהילדים שותים מים - הם שותים מול המדריכים</p>
                <p>*התכנית ניתנת לשינויים</p>
              </div>
            </section>
          )}

          {c.cycles && c.cycles.length > 0 && (
            <section className="rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-1 font-heebo text-3xl font-black text-[#182e86]">מחזורים ומחירים</h2>
              <div className="mb-6 h-1 w-10 rounded-full bg-[#F5C400]" />
              <CyclesAndPricing
                cycles={c.cycles}
                priceBasic={displayPrice}
                priceLabel={displayPriceLabel ?? undefined}
              />
            </section>
          )}

          {c.slug === "mitgalgalim" && (
            <section className="rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 text-right">
                <h2 className="mb-1 font-heebo text-3xl font-black text-[#182e86]">הצצה לחוויות מהקייטנה</h2>
                <div className="mb-3 h-1 w-10 rounded-full bg-[#F5C400]" />
                <p className="max-w-2xl text-base leading-7 text-slate-700">
                  רגעים קטנים מהפעילויות, האטרקציות והחוויות שמחכות לילדים לאורך הקיץ.
                </p>
              </div>
              <ExperienceGalleryCarousel items={MITGALGALIM_EXPERIENCE_GALLERY} />
            </section>
          )}

          {displayFaq.length > 0 && (
            <section className="rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-1 font-heebo text-3xl font-black text-[#182e86]">שאלות נפוצות</h2>
              <div className="mb-6 h-1 w-10 rounded-full bg-[#F5C400]" />
              <FaqAccordion items={displayFaq} />
            </section>
          )}

          {c.slug !== "mitgalgalim" && (
            <section id="contact-form-bottom" className="scroll-mt-24 rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-xl shadow-[#003087]/10 md:p-8">
              <div className="mb-6 text-center">
                <h2 className="mb-1 font-heebo text-3xl font-black text-[#182e86]">{leadFormTitle}</h2>
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#F5C400]" />
                <p className="text-base text-slate-700">נציג יחזור אליכם תוך 24 שעות</p>
              </div>
              <div className="mx-auto max-w-2xl">
                <ContactForm campId={c.id} campName={c.name} />
              </div>
            </section>
          )}
        </div>
      </main>

      {c.slug === "mitgalgalim" ? (
        <section
          id="contact-form-bottom"
          className="relative mt-6 scroll-mt-24 bg-[#003087] px-4 py-10 md:py-12"
        >
          <div className="container mx-auto">
            <div className="mx-auto max-w-5xl rounded-3xl border border-white/70 bg-white p-5 text-center shadow-2xl shadow-black/20 md:p-8">
              <div className="mb-5">
                <p className="mb-2 text-2xl font-black text-[#182e86] md:text-3xl">
                  רוצים לקבל פרטים נוספים על הקייטנה?
                </p>
                <h2 className="font-heebo text-3xl font-black leading-tight text-[#182e86] md:text-4xl">
                  השאירו פרטים ונחזור אליכם
                </h2>
                <img
                  src="/mitgalgalim/yellow-arrow.webp"
                  alt=""
                  aria-hidden="true"
                  className="mx-auto mt-3 h-14 w-auto object-contain md:h-16"
                />
              </div>
              <ContactForm campId={c.id} campName={c.name} variant="inline" />
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-6 bg-[#003087] px-4 py-12">
          <div className="container mx-auto text-center">
            <h2 className="mb-2 font-heebo text-3xl font-black text-white md:text-4xl">רוצים לשריין מקום?</h2>
            <p className="mb-6 text-base text-blue-200">המקומות מוגבלים - הירשמו עכשיו לפני שייגמר</p>
            <a
              href="#contact-form-bottom"
              className="inline-flex items-center gap-2 rounded-full bg-[#F5C400] px-10 py-4 text-base font-black text-[#003087] shadow-lg shadow-[#F5C400]/30 transition-colors hover:bg-[#e0b200]"
            >
              שלחו פנייה עכשיו
              <ArrowLeft className="h-4 w-4" />
            </a>
          </div>
        </section>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e0e8f0] bg-white px-4 py-3 shadow-2xl lg:hidden">
        <div className="flex items-center gap-3">
          <a
            href="#contact-form-bottom"
            className="flex-1 rounded-full bg-[#F5C400] py-3.5 text-center text-sm font-black text-[#003087] transition-colors hover:bg-[#e0b200]"
          >
            לפרטים נוספים
          </a>
          <a href={`https://wa.me/${whatsappPhone}`} className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30" aria-label="וואטסאפ">
            <MessageCircle className="h-6 w-6 text-white" />
          </a>
        </div>
      </div>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
