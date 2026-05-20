"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const CITIES = [
  "תל אביב", "ירושלים", "חיפה", "ראשון לציון", "פתח תקווה",
  "אשדוד", "נתניה", "באר שבע", "בני ברק", "הוד השרון",
  "רמת גן", "בת ים", "אשקלון", "רחובות", "לוד",
  "מודיעין", "הרצליה", "כפר סבא", "רעננה", "עפולה",
];

const publishSchema = z.object({
  name: z.string().min(2, "שם הקייטנה חייב להכיל לפחות 2 תווים"),
  city: z.string().min(1, "יש לבחור עיר"),
  description: z.string().min(10, "תיאור חייב להכיל לפחות 10 תווים"),
  age_min: z.number().min(3, "גיל מינימום לא יכול להיות פחות מ-3").max(18),
  age_max: z.number().min(3).max(18, "גיל מקסימום לא יכול לעלות על 18"),
  price_basic: z.number().min(0).optional(),
  price_advanced: z.number().min(0).optional(),
  package_type: z.enum(["basic", "advanced"] as const),
}).refine((d) => d.age_max >= d.age_min, {
  message: "גיל מקסימום חייב להיות גדול מגיל מינימום",
  path: ["age_max"],
});

type PublishFormValues = z.infer<typeof publishSchema>;

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
    defaultValues: { package_type: "basic", age_min: 6, age_max: 18 },
  });

  const selectedPackage = watch("package_type");

  const onSubmit = async (data: PublishFormValues) => {
    setError(null);
    const res = await fetch("/api/camps/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/dashboard?success=1");
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "אירעה שגיאה. אנא נסו שוב.");
    }
  };

  const inputCls = "w-full h-11 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-sm focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]";
  const errCls = "text-red-500 text-xs mt-1 pr-3";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input id="name" {...register("name")} placeholder="שם הקייטנה *" className={inputCls} />
        {errors.name && <p className={errCls}>{errors.name.message}</p>}
      </div>

      <div>
        <select
          id="city"
          {...register("city")}
          className={`${inputCls} text-gray-600`}
        >
          <option value="">בחר עיר *</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.city && <p className={errCls}>{errors.city.message}</p>}
      </div>

      <div>
        <textarea
          id="description"
          {...register("description")}
          placeholder="תיאור הקייטנה – פעילויות, יתרונות ומה מייחד אתכם *"
          rows={4}
          className="w-full rounded-2xl border border-[#e0e8f0] bg-[#F5F7FA] px-4 py-3 text-sm focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] resize-none"
        />
        {errors.description && <p className={errCls}>{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            id="age_min"
            type="number"
            {...register("age_min", { valueAsNumber: true })}
            placeholder="גיל מינימום *"
            min={3}
            max={18}
            className={inputCls}
          />
          {errors.age_min && <p className={errCls}>{errors.age_min.message}</p>}
        </div>
        <div>
          <input
            id="age_max"
            type="number"
            {...register("age_max", { valueAsNumber: true })}
            placeholder="גיל מקסימום *"
            min={3}
            max={18}
            className={inputCls}
          />
          {errors.age_max && <p className={errCls}>{errors.age_max.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          id="price_basic"
          type="number"
          {...register("price_basic", { valueAsNumber: true })}
          placeholder="מחיר בסיסי (₪)"
          className={inputCls}
        />
        <input
          id="price_advanced"
          type="number"
          {...register("price_advanced", { valueAsNumber: true })}
          placeholder="מחיר מתקדם (₪)"
          className={inputCls}
        />
      </div>

      <div>
        <p className="text-sm font-bold text-[#003087] mb-3">בחירת חבילת פרסום *</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(["basic", "advanced"] as const).map((pkg) => (
            <label
              key={pkg}
              className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPackage === pkg
                  ? "border-[#003087] bg-blue-50"
                  : "border-[#e0e8f0] hover:border-[#003087]/40"
              }`}
            >
              <input
                type="radio"
                value={pkg}
                {...register("package_type")}
                className="sr-only"
              />
              <span className="font-extrabold text-[#003087]">
                {pkg === "basic" ? "בסיסי – 299₪/שנה" : "מתקדם – 599₪/שנה"}
              </span>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                {pkg === "basic" ? (
                  <>
                    <li>✓ פרסום בסיסי</li>
                    <li>✓ תמונה אחת</li>
                    <li>✓ עד 50 פניות</li>
                  </>
                ) : (
                  <>
                    <li>✓ פרסום מועדף</li>
                    <li>✓ תמונות מרובות</li>
                    <li>✓ פניות ללא הגבלה</li>
                    <li>✓ אייקון &quot;מומלץ&quot;</li>
                  </>
                )}
              </ul>
              {selectedPackage === pkg && (
                <span className="absolute top-3 left-3 w-4 h-4 rounded-full bg-[#F5C400] border-2 border-[#003087]" />
              )}
            </label>
          ))}
        </div>
        {errors.package_type && <p className={errCls}>{errors.package_type.message as string}</p>}
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black py-3.5 rounded-full transition-colors text-base"
      >
        {isSubmitting ? "שולח..." : "המשך לתשלום »"}
      </button>
    </form>
  );
}
