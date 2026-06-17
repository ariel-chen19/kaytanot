"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const publishSchema = z
  .object({
    name: z.string().min(2, "שם הקייטנה חייב להכיל לפחות 2 תווים"),
    city: z.string().min(1, "יש לציין עיר מרכזית"),
    description: z.string().min(40, "על הקייטנה צריך להכיל לפחות 40 תווים"),
    tagline: z.string().min(5, "משפט מכירה קצר הוא חובה"),
    logo_url: z.string().url("קישור לוגו לא תקין").optional().or(z.literal("")),
    image_url: z.string().url("קישור תמונת פתיחה לא תקין").optional().or(z.literal("")),
    whatsapp: z.string().min(9, "יש להזין מספר WhatsApp").regex(/^[0-9+\-\s]+$/, "מספר WhatsApp לא תקין"),
    age_min: z.number().min(3, "גיל מינימום לא יכול להיות פחות מ-3").max(18),
    age_max: z.number().min(3).max(18, "גיל מקסימום לא יכול לעלות על 18"),
    price_basic: z.number().min(0).optional(),
    price_advanced: z.number().min(0).optional(),
    cities_text: z.string().min(2, "יש לציין לפחות עיר אחת"),
    cycles_text: z.string().min(5, "יש לציין לפחות מחזור אחד"),
    activities_text: z.string().min(5, "יש לציין לפחות כמה פעילויות"),
    gallery_text: z.string().optional(),
    why_us_text: z.string().min(5, "יש לציין לפחות יתרון אחד"),
    faq_text: z.string().optional(),
    package_type: z.enum(["basic", "advanced"] as const),
  })
  .refine((d) => d.age_max >= d.age_min, {
    message: "גיל מקסימום חייב להיות גדול מגיל מינימום",
    path: ["age_max"],
  });

type PublishFormValues = z.infer<typeof publishSchema>;

const fieldHelp = {
  cycles:
    "כל שורה: שם מחזור | תאריכים | ימים | שעות. לדוגמה: מחזור א | 1.7-21.7 | א-ה | 08:00-13:00",
  gallery:
    "כל שורה: שם פעילות | קישור לתמונה. אם אין תמונות כרגע, אפשר להשאיר ריק ולהוסיף בהמשך.",
  faq: "כל שורה: שאלה | תשובה",
};

export default function PublishForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PublishFormValues>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      package_type: "advanced",
      age_min: 6,
      age_max: 13,
      cities_text: "תל אביב\nרמת גן\nגבעתיים",
      cycles_text: "מחזור א | 1.7-21.7 | א-ה | 08:00-13:00\nמחזור ב | 22.7-11.8 | א-ה | 08:00-13:00",
      activities_text: "בריכה\nספורט\nיצירה\nאטרקציות\nיום כיף",
      why_us_text: "צוות הדרכה מקצועי\nיחס אישי לכל ילד\nביטוח ונהלי בטיחות\nחוויה מגוונת בכל יום",
      faq_text: "האם יש ביטוח? | כן, הפעילות מתקיימת עם ביטוח ונהלי בטיחות.\nאיך נרשמים? | משאירים פרטים בעמוד ונחזור אליכם עם כל המידע.",
    },
  });

  const selectedPackage = watch("package_type");

  const onSubmit = async (data: PublishFormValues) => {
    setError(null);
    const res = await fetch("/api/camps/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await res.json().catch(() => ({}));
    if (res.ok) {
      router.push(`/kaytana/${body.slug}`);
    } else {
      setError(body.error || "אירעה שגיאה. אנא נסו שוב.");
    }
  };

  const inputCls =
    "w-full rounded-2xl border border-[#d6deea] bg-white px-4 py-3 text-base focus:border-[#182e86] focus:outline-none focus:ring-1 focus:ring-[#182e86]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <section className="rounded-3xl border border-[#dfe7f2] bg-[#f6f8fc] p-5">
        <h3 className="font-heebo text-2xl font-black text-[#182e86]">פרטי פתיחה</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="שם הקייטנה *" error={errors.name?.message}>
            <input {...register("name")} className={inputCls} placeholder="לדוגמה: קייטנת הקיץ של..." />
          </Field>
          <Field label="עיר מרכזית *" error={errors.city?.message}>
            <input {...register("city")} className={inputCls} placeholder="לדוגמה: תל אביב" />
          </Field>
          <Field label="משפט מכירה קצר *" error={errors.tagline?.message}>
            <input {...register("tagline")} className={inputCls} placeholder="לדוגמה: קיץ מלא חוויות, חברים וביטחון" />
          </Field>
          <Field label="WhatsApp לקבלת לידים *" error={errors.whatsapp?.message}>
            <input {...register("whatsapp")} dir="ltr" className={inputCls} placeholder="055-999-9139" />
          </Field>
          <Field label="קישור ללוגו" error={errors.logo_url?.message}>
            <input {...register("logo_url")} dir="ltr" className={inputCls} placeholder="https://..." />
          </Field>
          <Field label="קישור לתמונת פתיחה" error={errors.image_url?.message}>
            <input {...register("image_url")} dir="ltr" className={inputCls} placeholder="https://..." />
          </Field>
        </div>
        <Field label="על הקייטנה *" error={errors.description?.message} className="mt-4">
          <textarea
            {...register("description")}
            rows={5}
            className={inputCls}
            placeholder="ספרו בקצרה מי אתם, מה הילדים חווים, מי הצוות ומה מיוחד בקייטנה."
          />
        </Field>
      </section>

      <section className="rounded-3xl border border-[#dfe7f2] bg-white p-5">
        <h3 className="font-heebo text-2xl font-black text-[#182e86]">גילאים, מחירים ומחזורים</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <Field label="גיל מינימום *" error={errors.age_min?.message}>
            <input type="number" {...register("age_min", { valueAsNumber: true })} className={inputCls} />
          </Field>
          <Field label="גיל מקסימום *" error={errors.age_max?.message}>
            <input type="number" {...register("age_max", { valueAsNumber: true })} className={inputCls} />
          </Field>
          <Field label="מחיר בסיסי" error={errors.price_basic?.message}>
            <input
              type="number"
              {...register("price_basic", {
                setValueAs: (value) => (value === "" ? undefined : Number(value)),
              })}
              className={inputCls}
              placeholder="2690"
            />
          </Field>
          <Field label="מחיר נוסף/מתקדם" error={errors.price_advanced?.message}>
            <input
              type="number"
              {...register("price_advanced", {
                setValueAs: (value) => (value === "" ? undefined : Number(value)),
              })}
              className={inputCls}
              placeholder="2790"
            />
          </Field>
        </div>
        <Field label="מחזורים *" error={errors.cycles_text?.message} className="mt-4" help={fieldHelp.cycles}>
          <textarea {...register("cycles_text")} rows={4} className={inputCls} />
        </Field>
      </section>

      <section className="rounded-3xl border border-[#dfe7f2] bg-white p-5">
        <h3 className="font-heebo text-2xl font-black text-[#182e86]">תוכן עמוד הנחיתה</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="ערים / אזורי פעילות *" error={errors.cities_text?.message} help="כל עיר בשורה נפרדת">
            <textarea {...register("cities_text")} rows={6} className={inputCls} />
          </Field>
          <Field label="פעילויות מרכזיות *" error={errors.activities_text?.message} help="כל פעילות בשורה נפרדת">
            <textarea {...register("activities_text")} rows={6} className={inputCls} />
          </Field>
          <Field label="למה לבחור בכם *" error={errors.why_us_text?.message} help="כל יתרון בשורה נפרדת">
            <textarea {...register("why_us_text")} rows={6} className={inputCls} />
          </Field>
          <Field label="גלריית אטרקציות" error={errors.gallery_text?.message} help={fieldHelp.gallery}>
            <textarea {...register("gallery_text")} rows={6} className={inputCls} placeholder="בריכה | https://..." />
          </Field>
        </div>
        <Field label="שאלות ותשובות" error={errors.faq_text?.message} className="mt-4" help={fieldHelp.faq}>
          <textarea {...register("faq_text")} rows={5} className={inputCls} />
        </Field>
      </section>

      <section className="rounded-3xl border border-[#dfe7f2] bg-white p-5">
        <h3 className="font-heebo text-2xl font-black text-[#182e86]">חבילת פרסום</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(["basic", "advanced"] as const).map((pkg) => (
            <label
              key={pkg}
              className={`relative cursor-pointer rounded-3xl border-2 p-5 transition-all ${
                selectedPackage === pkg
                  ? "border-[#182e86] bg-[#f6f8fc]"
                  : "border-[#dfe7f2] hover:border-[#182e86]/40"
              }`}
            >
              <input type="radio" value={pkg} {...register("package_type")} className="sr-only" />
              <span className="font-heebo text-xl font-black text-[#182e86]">
                {pkg === "basic" ? "בסיסי" : "מתקדם"}
              </span>
              <p className="mt-2 leading-7 text-slate-600">
                {pkg === "basic"
                  ? "עמוד קייטנה מלא וקבלת פניות."
                  : "עמוד קייטנה מלא, תצוגה עשירה והכנה לניהול לידים מתקדם."}
              </p>
            </label>
          ))}
        </div>
      </section>

      {error && <p className="rounded-2xl bg-red-50 p-4 text-center text-sm font-bold text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-[#F5C400] py-4 text-lg font-black text-[#182e86] transition-colors hover:bg-[#e0b200] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "בונה את עמוד הקייטנה..." : "בנו לי עמוד קייטנה"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  help,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  help?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block font-heebo text-lg font-black text-[#182e86]">{label}</label>
      {children}
      {help && <p className="mt-1 text-sm leading-6 text-slate-500">{help}</p>}
      {error && <p className="mt-1 pr-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
