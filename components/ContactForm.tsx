"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";

const contactSchema = z.object({
  parent_name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  parent_email: z.string().email("כתובת אימייל אינה תקינה"),
  parent_phone: z
    .string()
    .min(9, "מספר טלפון חייב להכיל לפחות 9 ספרות")
    .regex(/^[0-9+\-\s]+$/, "מספר טלפון אינו תקין"),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm({ campId, campName }: { campId: string; campName: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setError(null);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, camp_id: campId }),
    });
    if (res.ok) {
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
        <h3 className="text-xl font-black text-[#003087]">פנייתך התקבלה!</h3>
        <p className="text-gray-500 text-sm">
          תודה! פנייתך לקייטנת <strong>{campName}</strong> התקבלה. בעל הקייטנה יצור קשר בקרוב.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input
          id="parent_name"
          {...register("parent_name")}
          placeholder="שם מלא *"
          className="w-full h-11 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-sm focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
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
          className="w-full h-11 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-sm focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
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
          className="w-full h-11 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-sm focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]"
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
          className="w-full rounded-2xl border border-[#e0e8f0] bg-[#F5F7FA] px-4 py-3 text-sm focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black py-3 rounded-full transition-colors"
      >
        {isSubmitting ? "שולח..." : "שלח פנייה »"}
      </button>
    </form>
  );
}
