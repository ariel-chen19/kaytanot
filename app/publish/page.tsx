export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PublishForm from "@/components/PublishForm";
import { Check, Lock } from "lucide-react";

export default async function PublishPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/publish");
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Page header */}
      <div className="bg-[#003087] text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-3">פרסמו את הקייטנה שלכם</h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            הגיעו לאלפי הורים שמחפשים את הקייטנה המושלמת לילדיהם
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Pricing sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Basic */}
            <div className="bg-white rounded-2xl border-2 border-[#e0e8f0] p-5 shadow-sm">
              <p className="font-black text-lg text-[#003087] mb-1">בסיסי</p>
              <p className="text-4xl font-black text-[#003087] mb-4">
                299₪<span className="text-base font-normal text-gray-400">/שנה</span>
              </p>
              <ul className="space-y-2">
                {["פרסום בסיסי בפלטפורמה", "תמונה אחת", "עד 50 פניות מהורים", "עמוד קייטנה מלא"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Advanced */}
            <div className="bg-[#003087] rounded-2xl p-5 shadow-md relative overflow-hidden">
              <div className="absolute top-3 left-3 bg-[#F5C400] text-[#003087] text-xs font-black px-3 py-1 rounded-full">
                הכי פופולרי
              </div>
              <p className="font-black text-lg text-white mb-1 mt-6">מתקדם</p>
              <p className="text-4xl font-black text-[#F5C400] mb-4">
                599₪<span className="text-base font-normal text-blue-200">/שנה</span>
              </p>
              <ul className="space-y-2">
                {["פרסום מועדף (מיקום גבוה)", "תמונות מרובות", "פניות ללא הגבלה", "אייקון \"מומלץ\" בולט", "סטטיסטיקות צפיות"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-blue-100">
                    <Check className="w-4 h-4 text-[#F5C400] flex-shrink-0" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-[#e0e8f0] p-4 flex items-start gap-3">
              <Lock className="w-4 h-4 text-[#003087] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-[#003087]">תשלום מאובטח</p>
                <p className="text-xs text-gray-500 mt-0.5">הקייטנה תפורסם תוך 24 שעות מאישור התשלום.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <h2 className="font-black text-xl text-[#003087] mb-6">פרטי הקייטנה</h2>
              <PublishForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
