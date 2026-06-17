"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Check,
  Gift,
  Lock,
  ShieldCheck,
  Sparkles,
  TicketPercent,
  Trophy,
  Upload,
  X,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type BenefitCategory =
  | "הכל"
  | "אטרקציות"
  | "בריכות"
  | "הצגות"
  | "מסעדות"
  | "קייטנות"
  | "חופשות"
  | "חנויות";

type Benefit = {
  id: string;
  category: Exclude<BenefitCategory, "הכל">;
  title: string;
  discount: string;
  description: string;
  validUntil: string;
  image: string;
  couponCode: string;
  redemptionText: string;
  businessUrl: string;
};

const MEMBER_STORAGE_KEY = "kaytanot_benefits_member";

const categories: BenefitCategory[] = [
  "הכל",
  "אטרקציות",
  "בריכות",
  "הצגות",
  "מסעדות",
  "קייטנות",
  "חופשות",
  "חנויות",
];

const benefits: Benefit[] = [
  {
    id: "superland-family",
    category: "אטרקציות",
    title: "אטרקציות משפחתיות",
    discount: "בדיקת הטבה",
    description: "בדיקת זכאות להטבות באטרקציות וימי כיף למשפחות.",
    validUntil: "בתוקף עד 31.08.2026",
    image: "/mitgalgalim/luna-park-kaytana.webp",
    couponCode: "בדיקה ב-WhatsApp",
    redemptionText:
      "שלחו לנו הודעה ב-WhatsApp ונבדוק אילו הטבות זמינות עבורכם לפי אזור, ארגון וסוג פעילות.",
    businessUrl: "https://www.kaytanot.co.il/benefits",
  },
  {
    id: "pool-family",
    category: "בריכות",
    title: "בריכות וקאנטרי",
    discount: "בדיקת הטבה",
    description: "אפשרות להטבות על כניסה לבריכות, קאנטרי ופעילויות מים.",
    validUntil: "בתוקף עד 31.08.2026",
    image: "/mitgalgalim/brikha-kaytana.webp",
    couponCode: "בדיקה ב-WhatsApp",
    redemptionText: "שלחו לנו הודעה ונבדוק האם קיימת הטבה פעילה שמתאימה למשפחה שלכם.",
    businessUrl: "https://www.kaytanot.co.il/benefits",
  },
  {
    id: "kids-show",
    category: "הצגות",
    title: "הצגות ופעילויות תרבות",
    discount: "בדיקת הטבה",
    description: "בדיקת הטבות להצגות ילדים, מופעים ופעילויות משפחתיות.",
    validUntil: "בתוקף עד 15.09.2026",
    image: "/mitgalgalim/kolnoah-kaytana.webp",
    couponCode: "בדיקה ב-WhatsApp",
    redemptionText: "שלחו פרטים ונעדכן אם יש הטבות זמינות בתחום התרבות והפעילויות.",
    businessUrl: "https://www.kaytanot.co.il/benefits",
  },
  {
    id: "summer-camp",
    category: "קייטנות",
    title: "קייטנות קיץ",
    discount: "הטבות משתנות",
    description: "בדיקת הטבות וסבסודים לקייטנות דרך חברות, ארגונים וועדי עובדים.",
    validUntil: "בתוקף עד 20.07.2026",
    image: "/mitgalgalim/mitgalgalim.webp",
    couponCode: "בדיקת זכאות",
    redemptionText: "שלחו לנו את שם הארגון או מקום העבודה ונבדוק את אופן ההרשמה והזכאות.",
    businessUrl: "https://www.kaytanot.co.il/benefits",
  },
  {
    id: "water-park",
    category: "אטרקציות",
    title: "פארקי מים",
    discount: "בדיקת הטבה",
    description: "בדיקת הטבות לפארקי מים ופעילויות רטובות לימי הקיץ.",
    validUntil: "בתוקף עד 30.09.2026",
    image: "/mitgalgalim/park-maim-kaytana.webp",
    couponCode: "בדיקה ב-WhatsApp",
    redemptionText: "כתבו לנו מה האזור שלכם ונבדוק אילו אפשרויות רלוונטיות קיימות.",
    businessUrl: "https://www.kaytanot.co.il/benefits",
  },
  {
    id: "family-vacation",
    category: "חופשות",
    title: "חופשות משפחתיות",
    discount: "בדיקת הטבה",
    description: "בדיקת אפשרויות והטבות לחופשות קצרות למשפחות בתקופת החופש.",
    validUntil: "בתוקף עד 31.10.2026",
    image: "/mitgalgalim/mitgalgalim gallery1.webp",
    couponCode: "בדיקה ב-WhatsApp",
    redemptionText: "השאירו פרטים ונעדכן כאשר קיימת הטבה רלוונטית למשפחות.",
    businessUrl: "https://www.kaytanot.co.il/benefits",
  },
];

const faqItems = [
  {
    question: "ההצטרפות עולה כסף?",
    answer: "לא. ההצטרפות לרשימת ההטבות של Kaytanot היא ללא עלות.",
  },
  {
    question: "איך מקבלים את ההטבה?",
    answer:
      "לוחצים על ההטבה שמעניינת אתכם, מצטרפים בחינם, ולאחר מכן פרטי המימוש נפתחים על המסך.",
  },
  {
    question: "ההטבות מתעדכנות?",
    answer: "כן. ההטבות מתעדכנות מעת לעת, בעיקר לקראת חופשות, חגים וסופי שבוע.",
  },
  {
    question: "הפרטים שלי עוברים לעסקים אחרים?",
    answer: "לא. הפרטים נשמרים אצל Kaytanot ולא מועברים לעסק אחר ללא אישור מפורש.",
  },
  {
    question: "אפשר להסיר את ההרשמה?",
    answer: "כן. ניתן להסיר את ההרשמה בכל עת.",
  },
];

function hasStoredMember() {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(MEMBER_STORAGE_KEY);
  if (!raw) return false;
  try {
    const member = JSON.parse(raw) as { email?: string; phone?: string };
    return Boolean(member.email || member.phone);
  } catch {
    return false;
  }
}

function saveMember(member: { firstName: string; email: string; phone: string }) {
  window.localStorage.setItem(
    MEMBER_STORAGE_KEY,
    JSON.stringify({ ...member, savedAt: new Date().toISOString() })
  );
}

async function submitLead(payload: {
  firstName: string;
  email: string;
  phone: string;
  source: string;
  benefitName?: string;
  message?: string;
}) {
  const message = [
    payload.message,
    payload.benefitName ? `שם ההטבה: ${payload.benefitName}` : null,
    "brand: kaytanot",
    `source: ${payload.source}`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      parent_name: payload.firstName,
      parent_email: payload.email,
      parent_phone: payload.phone,
      message,
      source_page: "/benefits",
    }),
  });

  if (!response.ok) {
    throw new Error("lead_submit_failed");
  }
}

export default function BenefitsPageClient() {
  const [activeCategory, setActiveCategory] = useState<BenefitCategory>("הכל");
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [unlockedBenefit, setUnlockedBenefit] = useState<Benefit | null>(null);
  const [benefitSubmitting, setBenefitSubmitting] = useState(false);
  const [benefitError, setBenefitError] = useState<string | null>(null);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const filteredBenefits = useMemo(() => {
    if (activeCategory === "הכל") return benefits;
    return benefits.filter((benefit) => benefit.category === activeCategory);
  }, [activeCategory]);

  const openBenefit = (benefit: Benefit) => {
    trackEvent("benefit_card_click", {
      benefit_name: benefit.title,
      benefit_category: benefit.category,
      discount_label: benefit.discount,
    });

    if (hasStoredMember()) {
      setUnlockedBenefit(benefit);
      trackEvent("benefit_reveal", {
        benefit_name: benefit.title,
        benefit_category: benefit.category,
        discount_label: benefit.discount,
      });
      return;
    }

    setSelectedBenefit(benefit);
    setBenefitError(null);
    trackEvent("benefit_unlock_modal_open", {
      benefit_name: benefit.title,
      benefit_category: benefit.category,
      discount_label: benefit.discount,
    });
  };

  const handleBenefitSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedBenefit) return;

    const formData = new FormData(event.currentTarget);
    const member = {
      firstName: String(formData.get("firstName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
    };

    setBenefitSubmitting(true);
    setBenefitError(null);

    try {
      await submitLead({
        ...member,
        benefitName: selectedBenefit.title,
        source: "benefits_page",
      });
      saveMember(member);
      setUnlockedBenefit(selectedBenefit);
      setSelectedBenefit(null);
      trackEvent("benefit_lead_submit", {
        benefit_name: selectedBenefit.title,
        benefit_category: selectedBenefit.category,
        discount_label: selectedBenefit.discount,
      });
      trackEvent("benefit_reveal", {
        benefit_name: selectedBenefit.title,
        benefit_category: selectedBenefit.category,
        discount_label: selectedBenefit.discount,
      });
    } catch {
      setBenefitError("אירעה שגיאה בשמירת הפרטים. נסו שוב בעוד רגע.");
    } finally {
      setBenefitSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const member = {
      firstName: String(formData.get("firstName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
    };

    await submitLead({
      ...member,
      source: "benefits_newsletter",
      message: "הרשמה לעדכוני הטבות למשפחות",
    });
    saveMember(member);
    setNewsletterSubmitted(true);
    trackEvent("newsletter_submit", { signup_location: "benefits_page" });
  };

  const handleChallengeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await submitLead({
      firstName: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      source: "holiday_challenge",
      message: `אתגר החופש: ${String(formData.get("activity") || "").trim()}`,
    });
    setChallengeSubmitted(true);
    trackEvent("challenge_submit", { challenge_name: "אתגר החופש" });
  };

  return (
    <div className="bg-[#f5f8fc] text-slate-900">
      <section className="px-4 pt-4">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-xl shadow-[#003087]/10 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="mb-2 text-sm font-black text-[#182e86]">
                הטבות, רעיונות וחוויות למשפחות
              </p>
              <h1 className="font-rubik text-4xl font-black leading-[0.98] text-[#182e86] md:text-5xl lg:text-[52px]">
                הטבות למשפחות
              </h1>
              <div className="mb-5 mt-3 h-1 w-14 rounded-full bg-[#F5C400]" />
              <p className="max-w-2xl font-heebo text-2xl font-black leading-snug text-[#0f1f5c] md:text-3xl">
                עוזרים לכם לעבור את החופש בכיף, בלי לשלם מחיר מלא כשלא חייבים.
              </p>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                ריכזנו עבורכם הטבות וקופונים שמתאימים בדיוק להורים ולמשפחות:
                בריכות, אטרקציות, הצגות, מסעדות, חופשות ועוד. את ההטבות אפשר
                לראות כאן, ואת פרטי המימוש מקבלים לאחר הצטרפות קצרה וללא עלות.
              </p>
            </div>

            <div className="rounded-3xl border border-[#dfe7f2] bg-white p-4 shadow-xl shadow-[#003087]/10">
              <div className="relative h-48 overflow-hidden rounded-2xl">
                <Image
                  src="/mitgalgalim/brikha-kaytana.webp"
                  alt="בילוי משפחתי בבריכה"
                  fill
                  sizes="(min-width: 1024px) 380px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  ["ללא עלות", "מצטרפים בחינם לרשימת ההטבות"],
                  ["הטבות מתעדכנות", "אטרקציות, בריכות, הצגות וחופשות"],
                  ["פרטי המימוש נפתחים מיד", "אחרי הרשמה קצרה וללא התחייבות"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl bg-[#f6f8fc] px-4 py-3">
                    <p className="font-heebo text-base font-black text-[#182e86]">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-center">
                <p className="font-heebo text-4xl font-black leading-none text-[#182e86]">
                  הטבות מתעדכנות
                </p>
                <p className="mt-1 font-bold text-slate-500">בהטבות נבחרות למשפחות</p>
              </div>
              <a
                href="#benefits-list"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F5C400] px-7 py-3 text-base font-black text-[#182e86] shadow-lg shadow-[#F5C400]/30 transition-colors hover:bg-[#e0b200]"
              >
                פתחו את ההטבות
                <ArrowLeft className="h-4 w-4" />
              </a>
              <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                הפרטים נשמרים אצל Kaytanot ולא מועברים לעסקים ללא אישור.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits-list" className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center">
          <h2 className="font-heebo text-3xl font-black text-[#182e86] md:text-4xl">
            בחרו את סוג ההטבה שמתאים לכם
          </h2>
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[#F5C400]" />
        </div>
        <div className="mt-7 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-black transition-colors ${
                activeCategory === category
                  ? "border-[#182e86] bg-[#182e86] text-white"
                  : "border-[#dfe7f2] bg-white text-[#182e86] hover:border-[#182e86]/40"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-6">
          <p className="mb-1 text-sm font-black text-[#182e86]">הטבות החודש</p>
          <h2 className="font-heebo text-3xl font-black text-[#182e86]">הטבות החודש</h2>
          <div className="mt-2 h-1 w-10 rounded-full bg-[#F5C400]" />
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            ההטבות מתעדכנות מעת לעת. מומלץ להצטרף כדי לקבל עדכונים על הטבות חדשות לפני כולם.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredBenefits.map((benefit) => (
            <article
              key={benefit.id}
              className="overflow-hidden rounded-3xl border border-[#dfe7f2] bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#003087]/10"
            >
              <div className="relative h-48">
                <Image
                  src={benefit.image}
                  alt={benefit.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute right-4 top-4 rounded-full bg-[#F5C400] px-4 py-2 text-sm font-black text-[#182e86]">
                  {benefit.discount}
                </span>
              </div>
              <div className="p-5">
                <span className="rounded-full bg-[#f6f8fc] px-3 py-1 text-xs font-black text-[#182e86]">
                  {benefit.category}
                </span>
                <h3 className="mt-4 font-heebo text-xl font-black text-[#182e86]">
                  {benefit.title}
                </h3>
                <p className="mt-2 min-h-14 leading-7 text-slate-600">{benefit.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-500">
                  <Calendar className="h-4 w-4 text-[#182e86]" />
                  {benefit.validUntil}
                </div>
                <button
                  type="button"
                  onClick={() => openBenefit(benefit)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#182e86] px-5 py-3 text-base font-black text-white transition-colors hover:bg-[#111f5c]"
                >
                  קבלו את ההטבה
                  <TicketPercent className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-6 rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:grid-cols-[1.15fr_0.85fr] md:p-8">
          <div>
            <p className="mb-2 text-sm font-black text-[#182e86]">אתגר החופש</p>
            <h2 className="font-heebo text-3xl font-black text-[#182e86] md:text-4xl">
              אתגר החופש למשפחות
            </h2>
            <div className="mt-3 h-1 w-10 rounded-full bg-[#F5C400]" />
            <p className="mt-5 text-xl font-bold leading-8 text-slate-800">
              משימה משפחתית קטנה, חוויה גדולה, ואפשרות לזכות בפרס.
            </p>
            <p className="mt-3 leading-8 text-slate-600">
              בכל חופש נעלה כאן משימה משפחתית פשוטה שאפשר לעשות בבית, בחוץ או בטיול.
              מבצעים את המשימה, שולחים לנו תמונה או תיאור קצר, ונכנסים להגרלה על פרס משפחתי.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["מבצעים את המשימה", "שולחים תמונה או תיאור", "נכנסים להגרלה"].map((step, index) => (
                <div key={step} className="rounded-2xl bg-[#f6f8fc] p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5C400] text-sm font-black text-[#182e86]">
                    {index + 1}
                  </span>
                  <p className="mt-3 font-bold text-[#182e86]">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-[#f6f8fc] p-5">
            <Sparkles className="h-8 w-8 text-[#F5C400]" />
            <h3 className="mt-4 font-heebo text-2xl font-black text-[#182e86]">
              פעילות משפחתית אחת בלי מסכים
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              צאו לפיקניק, משחק קופסה, טיול קצר או כל רעיון שמתאים לכם.
            </p>
            <div className="mt-5 rounded-2xl border border-[#dfe7f2] bg-white p-4">
              <Trophy className="h-5 w-5 text-[#F5C400]" />
              <p className="mt-2 font-black text-[#182e86]">פרס לדוגמה</p>
              <p className="text-sm text-slate-500">4 כרטיסים לאטרקציה משפחתית</p>
            </div>
            <button
              type="button"
              onClick={() => setChallengeOpen(true)}
              className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[#F5C400] px-5 py-3 text-base font-black text-[#182e86] hover:bg-[#e0b200]"
            >
              השתתפו באתגר
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-8 rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-xl shadow-[#003087]/10 md:grid-cols-2 md:p-8">
          <div>
            <p className="mb-2 text-sm font-black text-[#182e86]">עדכונים להורים</p>
            <h2 className="font-heebo text-3xl font-black text-[#182e86]">
              רוצים לקבל הטבות חדשות לפני כולם?
            </h2>
            <div className="mt-3 h-1 w-10 rounded-full bg-[#F5C400]" />
            <p className="mt-5 leading-8 text-slate-600">
              הצטרפו לרשימת העדכונים שלנו וקבלו מדי פעם הטבות למשפחות, מבצעים
              לקייטנות, אטרקציות לחופשים ועדכונים שווים להורים.
            </p>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#f6f8fc] p-4 text-sm leading-6 text-slate-600">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#182e86]" />
              אנחנו לא מציפים. שולחים רק דברים שבאמת יכולים לעניין הורים ומשפחות.
            </div>
          </div>

          {newsletterSubmitted ? (
            <div className="flex items-center justify-center rounded-3xl bg-[#f6f8fc] p-8 text-center">
              <div>
                <Check className="mx-auto h-10 w-10 text-green-600" />
                <h3 className="mt-4 font-heebo text-2xl font-black text-[#182e86]">
                  נרשמתם לעדכונים
                </h3>
                <p className="mt-2 text-slate-500">נעדכן כשיש משהו שווה למשפחות.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="grid gap-3">
              <Input name="firstName" placeholder="שם פרטי" required />
              <Input name="email" type="email" placeholder="אימייל" required dir="ltr" />
              <Input name="phone" type="tel" placeholder="טלפון" required dir="ltr" />
              <button className="rounded-full bg-[#F5C400] py-3.5 text-base font-black text-[#182e86] hover:bg-[#e0b200]">
                הצטרפו לעדכונים
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:p-8">
          <h2 className="font-heebo text-3xl font-black text-[#182e86]">שאלות נפוצות</h2>
          <div className="mt-3 h-1 w-10 rounded-full bg-[#F5C400]" />
          <div className="mt-6 grid gap-3">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-2xl bg-[#f6f8fc] p-4">
                <summary className="cursor-pointer list-none font-black text-[#182e86]">
                  {item.question}
                </summary>
                <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {selectedBenefit && (
        <BenefitModal
          benefit={selectedBenefit}
          error={benefitError}
          isSubmitting={benefitSubmitting}
          onClose={() => setSelectedBenefit(null)}
          onSubmit={handleBenefitSubmit}
        />
      )}

      {unlockedBenefit && (
        <UnlockedBenefitModal benefit={unlockedBenefit} onClose={() => setUnlockedBenefit(null)} />
      )}

      {challengeOpen && (
        <ChallengeModal
          submitted={challengeSubmitted}
          onClose={() => {
            setChallengeOpen(false);
            setChallengeSubmitted(false);
          }}
          onSubmit={handleChallengeSubmit}
        />
      )}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-full border border-[#dfe7f2] bg-[#f6f8fc] px-5 text-sm outline-none transition focus:border-[#182e86] focus:ring-2 focus:ring-[#182e86]/10"
    />
  );
}

function BenefitModal({
  benefit,
  error,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  benefit: Benefit;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Modal onClose={onClose}>
      <p className="text-sm font-black text-[#182e86]">{benefit.title} · {benefit.discount}</p>
      <h2 className="mt-2 font-heebo text-3xl font-black text-[#182e86]">
        ההטבה זמינה לחברי Kaytanot
      </h2>
      <p className="mt-3 leading-7 text-slate-600">
        כדי לקבל את פרטי המימוש של ההטבה, הצטרפו בחינם לרשימת ההטבות של Kaytanot.
        ההרשמה קצרה, וללא התחייבות.
      </p>
      <form onSubmit={onSubmit} className="mt-5 grid gap-3">
        <Input name="firstName" placeholder="שם פרטי" required />
        <Input name="email" type="email" placeholder="אימייל" required dir="ltr" />
        <Input name="phone" type="tel" placeholder="טלפון" required dir="ltr" />
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
          <input type="checkbox" required className="mt-1 h-4 w-4 accent-[#182e86]" />
          אני מאשר/ת לקבל עדכונים והטבות מ-Kaytanot. ניתן להסיר את ההרשמה בכל עת.
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={isSubmitting}
          className="rounded-full bg-[#F5C400] py-3.5 text-base font-black text-[#182e86] hover:bg-[#e0b200] disabled:opacity-60"
        >
          {isSubmitting ? "שולחים..." : "הצטרפו וקבלו את ההטבה"}
        </button>
      </form>
      <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
        <Lock className="h-3.5 w-3.5" />
        הפרטים נשמרים אצל Kaytanot ולא מועברים לעסקים ללא אישור.
      </p>
    </Modal>
  );
}

function UnlockedBenefitModal({ benefit, onClose }: { benefit: Benefit; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <Gift className="mx-auto h-11 w-11 text-[#F5C400]" />
        <h2 className="mt-3 font-heebo text-3xl font-black text-[#182e86]">ההטבה נפתחה</h2>
        <p className="mt-3 leading-7 text-slate-600">
          מצוין, פרטי ההטבה מחכים לכם כאן. שמרו את הקוד כדי למצוא אותו בקלות.
        </p>
        <div className="mt-5 rounded-3xl border border-dashed border-[#182e86]/40 bg-[#f6f8fc] p-5">
          <p className="text-sm font-bold text-slate-500">קוד קופון</p>
          <p className="mt-1 font-heebo text-4xl font-black tracking-wide text-[#182e86]">
            {benefit.couponCode}
          </p>
        </div>
        <p className="mt-4 rounded-2xl bg-[#FFF8D6] p-4 leading-7 text-slate-700">
          {benefit.redemptionText}
        </p>
        <a
          href={benefit.businessUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#182e86] py-3.5 font-black text-white hover:bg-[#111f5c]"
        >
          מעבר לאתר העסק
        </a>
      </div>
    </Modal>
  );
}

function ChallengeModal({
  submitted,
  onClose,
  onSubmit,
}: {
  submitted: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Modal onClose={onClose}>
      {submitted ? (
        <div className="py-8 text-center">
          <Check className="mx-auto h-10 w-10 text-green-600" />
          <h2 className="mt-4 font-heebo text-3xl font-black text-[#182e86]">השתתפות נשלחה</h2>
          <p className="mt-2 text-slate-500">קיבלנו את הפרטים וניצור קשר אם תזכו בפרס.</p>
        </div>
      ) : (
        <>
          <h2 className="font-heebo text-3xl font-black text-[#182e86]">השתתפו באתגר החופש</h2>
          <form onSubmit={onSubmit} className="mt-5 grid gap-3">
            <Input name="name" placeholder="שם" required />
            <Input name="phone" type="tel" placeholder="טלפון" required dir="ltr" />
            <Input name="email" type="email" placeholder="אימייל" required dir="ltr" />
            <textarea
              name="activity"
              required
              rows={4}
              placeholder="מה עשיתם באתגר?"
              className="w-full rounded-3xl border border-[#dfe7f2] bg-[#f6f8fc] px-5 py-4 text-sm outline-none transition focus:border-[#182e86] focus:ring-2 focus:ring-[#182e86]/10"
            />
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#dfe7f2] bg-[#f6f8fc] px-5 py-4 text-sm font-bold text-[#182e86]">
              <Upload className="h-4 w-4" />
              העלאת תמונה - אופציונלי
              <input type="file" accept="image/*" className="hidden" />
            </label>
            <button className="rounded-full bg-[#F5C400] py-3.5 text-base font-black text-[#182e86] hover:bg-[#e0b200]">
              שלחו השתתפות
            </button>
          </form>
        </>
      )}
    </Modal>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/55 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        className="relative max-h-[calc(100vh-48px)] w-full max-w-xl overflow-auto rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-2xl md:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="סגירה"
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f8fc] text-slate-500 hover:text-[#182e86]"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
