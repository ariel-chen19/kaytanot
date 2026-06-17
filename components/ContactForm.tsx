"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const fullContactSchema = z.object({
  parent_name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  parent_email: z.string().email("כתובת אימייל אינה תקינה"),
  parent_phone: z
    .string()
    .min(9, "מספר טלפון חייב להכיל לפחות 9 ספרות")
    .regex(/^[0-9+\-\s]+$/, "מספר טלפון אינו תקין"),
  message: z.string().optional(),
  privacy_consent: z.literal(true, {
    error: "יש לאשר את מדיניות הפרטיות",
  }),
});

const inlineContactSchema = fullContactSchema.extend({
  parent_email: z.string().email("כתובת אימייל אינה תקינה").optional().or(z.literal("")),
});

type ContactFormValues = z.infer<typeof inlineContactSchema>;

export default function ContactForm({
  campId,
  campName,
  variant = "default",
}: {
  campId: string;
  campName: string;
  variant?: "default" | "inline";
}) {
  const isInline = variant === "inline";
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(isInline ? inlineContactSchema : fullContactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setError(null);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parent_name: data.parent_name,
        parent_phone: data.parent_phone,
        parent_email: data.parent_email || undefined,
        message: data.message,
        camp_id: campId,
      }),
    });
    if (res.ok) {
      trackEvent("generate_lead", {
        camp_id: campId,
        camp_name: campName,
        form_variant: variant,
      });
      setSubmitted(true);
    } else {
      setError("אירעה שגיאה. אנא נסו שוב.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-heebo text-xl font-black text-[#003087]">פנייתך התקבלה!</h3>
        <p className="text-[15px] leading-7 text-slate-500">
          תודה! פנייתך לקייטנת <strong>{campName}</strong> התקבלה. צוות הקייטנה יחזור אליכם בקרוב.
        </p>
      </div>
    );
  }

  if (isInline) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <div>
            <input
              id="parent_name_inline"
              {...register("parent_name")}
              placeholder="שם מלא *"
              autoComplete="name"
              required
              className="h-[52px] w-full rounded-xl border border-[#d6deea] bg-white px-4 text-base focus:border-[#003087] focus:outline-none focus:ring-1 focus:ring-[#003087] md:h-14 md:px-5"
            />
            {errors.parent_name && (
              <p className="mt-1 pr-2 text-xs text-red-500">{errors.parent_name.message}</p>
            )}
          </div>

          <div>
            <input
              id="parent_phone_inline"
              type="tel"
              {...register("parent_phone")}
              placeholder="טלפון *"
              dir="ltr"
              inputMode="tel"
              autoComplete="tel"
              required
              className="h-[52px] w-full rounded-xl border border-[#d6deea] bg-white px-4 text-base focus:border-[#003087] focus:outline-none focus:ring-1 focus:ring-[#003087] md:h-14 md:px-5"
            />
            {errors.parent_phone && (
              <p className="mt-1 pr-2 text-xs text-red-500">{errors.parent_phone.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[52px] rounded-xl bg-[#F5C400] px-8 text-base font-black text-[#003087] transition-colors hover:bg-[#e0b200] disabled:cursor-not-allowed disabled:opacity-70 md:h-14 md:px-10 md:text-lg"
          >
            {isSubmitting ? "שולח..." : "שלחו פרטים"}
          </button>
        </div>

        <label className="flex cursor-pointer items-start gap-2 text-sm leading-6 text-slate-600">
          <input
            type="checkbox"
            {...register("privacy_consent")}
            required
            className="mt-1 h-4 w-4 flex-shrink-0 accent-[#182e86]"
          />
          <span>
            אני מאשר/ת את העברת הפרטים לצורך יצירת קשר בהתאם ל
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#182e86] underline"
            >
              מדיניות הפרטיות
            </a>
            .
          </span>
        </label>
        {errors.privacy_consent && (
          <p className="text-sm text-red-500">{errors.privacy_consent.message}</p>
        )}

        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input
          id="parent_name"
          {...register("parent_name")}
          placeholder="שם מלא *"
          autoComplete="name"
          required
          className="w-full h-12 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-[15px] focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
        />
        {errors.parent_name && (
          <p className="text-red-500 text-xs mt-1 pr-3">{errors.parent_name.message}</p>
        )}
      </div>

      <div>
        <input
          id="parent_email"
          type="email"
          {...register("parent_email")}
          placeholder="אימייל *"
          dir="ltr"
          autoComplete="email"
          required
          className="w-full h-12 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-[15px] focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
        />
        {errors.parent_email && (
          <p className="text-red-500 text-xs mt-1 pr-3">{errors.parent_email.message}</p>
        )}
      </div>

      <div>
        <input
          id="parent_phone"
          type="tel"
          {...register("parent_phone")}
          placeholder="טלפון *"
          dir="ltr"
          inputMode="tel"
          autoComplete="tel"
          required
          className="w-full h-12 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-[15px] focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
        />
        {errors.parent_phone && (
          <p className="text-red-500 text-xs mt-1 pr-3">{errors.parent_phone.message}</p>
        )}
      </div>

      <div>
        <textarea
          id="message"
          {...register("message")}
          placeholder="הודעה (אופציונלי)"
          rows={3}
          className="w-full rounded-2xl border border-[#e0e8f0] bg-[#F5F7FA] px-4 py-3 text-[15px] focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] resize-none"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-2 px-2 text-sm leading-6 text-slate-600">
        <input
          type="checkbox"
          {...register("privacy_consent")}
          required
          className="mt-1 h-4 w-4 flex-shrink-0 accent-[#003087]"
        />
        <span>
          אני מאשר/ת את העברת הפרטים לצורך יצירת קשר בהתאם ל
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#003087] underline"
          >
            מדיניות הפרטיות
          </a>
          .
        </span>
      </label>
      {errors.privacy_consent && (
        <p className="px-2 text-xs text-red-500">{errors.privacy_consent.message}</p>
      )}

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black py-3.5 rounded-full transition-colors text-base"
      >
        {isSubmitting ? "שולח..." : "שלח פנייה »"}
      </button>
    </form>
  );
}
