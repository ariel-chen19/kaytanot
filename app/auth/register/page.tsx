"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const registerSchema = z
  .object({
    email: z.string().email("כתובת אימייל אינה תקינה"),
    password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "הסיסמאות אינן תואמות",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (authError) {
      setError(authError.message === "User already registered"
        ? "כתובת אימייל זו כבר רשומה במערכת."
        : "אירעה שגיאה ברישום. אנא נסו שוב.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  const inputCls = "w-full h-11 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-sm focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003087] to-[#1a4aa8] flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className="bg-[#F5C400] rounded-full w-12 h-12 flex items-center justify-center text-[#003087] font-black text-2xl">
              ק
            </div>
          </div>
          <CardTitle className="text-2xl font-black text-[#003087]">הרשמה לקייטנות</CardTitle>
          <p className="text-gray-500 text-sm">פרסמו את הקייטנה שלכם והגיעו לאלפי הורים</p>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-6">
              <span className="text-5xl mb-4 block">🎉</span>
              <h3 className="font-black text-lg text-[#003087] mb-2">ברוכים הבאים!</h3>
              <p className="text-gray-500 text-sm">החשבון נוצר בהצלחה. מועברים ללוח הבקרה...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <input id="email" type="email" {...register("email")} placeholder="אימייל" dir="ltr" className={inputCls} />
                {errors.email && <p className="text-red-500 text-xs mt-1 pr-3">{errors.email.message}</p>}
              </div>
              <div>
                <input id="password" type="password" {...register("password")} placeholder="סיסמה (לפחות 6 תווים)" dir="ltr" className={inputCls} />
                {errors.password && <p className="text-red-500 text-xs mt-1 pr-3">{errors.password.message}</p>}
              </div>
              <div>
                <input id="confirmPassword" type="password" {...register("confirmPassword")} placeholder="אימות סיסמה" dir="ltr" className={inputCls} />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 pr-3">{errors.confirmPassword.message}</p>}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-2xl border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black py-3 rounded-full transition-colors"
              >
                {isSubmitting ? "נרשם..." : "הרשמה »"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            כבר יש לכם חשבון?{" "}
            <Link href="/auth/login" className="text-[#003087] hover:underline font-bold">
              כניסה
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
