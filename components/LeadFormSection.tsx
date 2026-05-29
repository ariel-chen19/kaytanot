"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Lock } from "lucide-react";

const schema = z.object({
  child_name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  last_name: z.string().min(2, "שם משפחה חייב להכיל לפחות 2 תווים"),
  child_age: z.number({ error: "גיל לא תקין" }).min(3).max(18),
  preferred_track: z.string().optional(),
  parent_phone: z.string().min(9, "מספר טלפון אינו תקין"),
  parent_email: z.string().email("אימייל לא תקין"),
});

type FormValues = z.infer<typeof schema>;

const TRACKS = ["ריקוד", "טניס", "שחייה", "כדורגל", "כל המסלולים"];

const PERKS = [
  "פעילויות מקצועיות ומתקדמות",
  "מדריכים מוסמכים ומנוסים",
  "קבוצות קטנות ויחס אישי",
  "שעות, חברים ותכרית יות לכל הימים",
];

export default function LeadFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parent_name:     data.child_name,
        parent_email:    data.parent_email,
        parent_phone:    data.parent_phone,
        child_name:      data.child_name,
        last_name:       data.last_name,
        child_age:       data.child_age,
        preferred_track: data.preferred_track,
      }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      setServerError("אירעה שגיאה. אנא נסו שוב.");
    }
  };

  return (
    <div className="bg-[#003087]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left column — benefits / pitch */}
          <div className="text-white">
            <div className="inline-block bg-[#F5C400] text-[#003087] text-xs font-black px-4 py-1.5 rounded-full mb-5">
              הרשמה ביתומות!
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              מקומות מוגבלים!
              <br />
              <span className="text-[#F5C400]">השאירו פרטים ונחזור אליכם</span>
            </h2>
            <p className="text-blue-200 text-base mb-8 leading-relaxed">
              הצטרפו לאלפי משפחות שכבר בחרו בנו — מלאו את הטופס ואחד מנציגינו יחזור אליכם תוך 24 שעות.
            </p>

            <ul className="space-y-3">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-blue-100">
                  <span className="w-5 h-5 rounded-full bg-[#F5C400]/20 border border-[#F5C400] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#F5C400]" strokeWidth={3} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          {/* Right column — form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-[#003087] mb-2">תודה! קיבלנו את הפרטים</h3>
                <p className="text-gray-500 text-sm">נציג שלנו יצור קשר תוך 24 שעות</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <h3 className="font-black text-xl text-[#003087] mb-4 text-center">השאירו פרטים ונחזור אליכם</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      {...register("child_name")}
                      placeholder="שם הילד *"
                      className="w-full h-11 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-sm focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
                    />
                    {errors.child_name && <p className="text-red-500 text-xs mt-1 pr-3">{errors.child_name.message}</p>}
                  </div>
                  <div>
                    <input
                      {...register("last_name")}
                      placeholder="שם משפחה *"
                      className="w-full h-11 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-sm focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
                    />
                    {errors.last_name && <p className="text-red-500 text-xs mt-1 pr-3">{errors.last_name.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      {...register("child_age", { valueAsNumber: true })}
                      type="number"
                      placeholder="גיל הילד *"
                      min={3}
                      max={18}
                      className="w-full h-11 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-sm focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
                    />
                    {errors.child_age && <p className="text-red-500 text-xs mt-1 pr-3">{errors.child_age.message}</p>}
                  </div>
                  <div>
                    <select
                      {...register("preferred_track")}
                      className="w-full h-11 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-sm focus:outline-none focus:border-[#003087] text-gray-500"
                    >
                      <option value="">מסלול מועדף</option>
                      {TRACKS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <input
                    {...register("parent_phone")}
                    type="tel"
                    placeholder="טלפון *"
                    dir="ltr"
                    className="w-full h-11 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-sm focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
                  />
                  {errors.parent_phone && <p className="text-red-500 text-xs mt-1 pr-3">{errors.parent_phone.message}</p>}
                </div>

                <div>
                  <input
                    {...register("parent_email")}
                    type="email"
                    placeholder="אימייל *"
                    dir="ltr"
                    className="w-full h-11 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-sm focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
                  />
                  {errors.parent_email && <p className="text-red-500 text-xs mt-1 pr-3">{errors.parent_email.message}</p>}
                </div>

                {serverError && (
                  <p className="text-red-500 text-sm text-center">{serverError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black py-3.5 rounded-full transition-colors text-base mt-2"
                >
                  {isSubmitting ? "שולח..." : "שלח פרטים »"}
                </button>

                <p className="text-center text-gray-400 text-xs flex items-center justify-center gap-1.5 mt-2">
                  <Lock className="w-3 h-3" />
                  הפרטים מוצפנים ולא יועברו לגורם אחר
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
