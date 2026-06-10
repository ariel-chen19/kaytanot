"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("כתובת אימייל אינה תקינה"),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const oauthFailed = searchParams.get("error") === "oauth";
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (authError) {
      setError("פרטי הכניסה שגויים. אנא בדקו ונסו שוב.");
    } else {
      router.push(redirectTo);
      router.refresh();
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });

    if (authError) {
      setError("לא הצלחנו להתחבר עם Google. נסו שוב בעוד רגע.");
    }
  };

  const inputCls = "w-full h-11 rounded-full border border-[#e0e8f0] bg-[#F5F7FA] px-4 text-sm focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]";

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={signInWithGoogle}
        className="w-full h-12 rounded-full border border-[#e0e8f0] bg-white hover:bg-[#F5F7FA] text-[#003087] font-black transition-colors flex items-center justify-center gap-3"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-[#e0e8f0] text-sm font-black">G</span>
        התחברות עם Google
      </button>

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-[#e0e8f0]" />
        או התחברות עם סיסמה
        <span className="h-px flex-1 bg-[#e0e8f0]" />
      </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input
          id="email"
          type="email"
          {...register("email")}
          placeholder="אימייל"
          dir="ltr"
          className={inputCls}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1 pr-3">{errors.email.message}</p>}
      </div>

      <div>
        <input
          id="password"
          type="password"
          {...register("password")}
          placeholder="סיסמה"
          dir="ltr"
          className={inputCls}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1 pr-3">{errors.password.message}</p>}
      </div>

      {(error || oauthFailed) && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-2xl border border-red-200">
          {error || "ההתחברות עם Google לא הושלמה. נסו שוב."}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black py-3 rounded-full transition-colors"
      >
        {isSubmitting ? "מתחבר..." : "כניסה »"}
      </button>
    </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003087] to-[#1a4aa8] flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className="bg-[#F5C400] rounded-full w-12 h-12 flex items-center justify-center text-[#003087] font-black text-2xl">
              ק
            </div>
          </div>
          <CardTitle className="text-2xl font-black text-[#003087]">כניסה לחשבון</CardTitle>
          <p className="text-gray-500 text-sm">ברוכים השבים לקייטנות!</p>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-40 animate-pulse bg-[#F5F7FA] rounded-2xl" />}>
            <LoginForm />
          </Suspense>

          <p className="text-center text-sm text-gray-500 mt-6">
            אין לכם חשבון?{" "}
            <Link href="/auth/register" className="text-[#003087] hover:underline font-bold">
              הרשמה עכשיו
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
