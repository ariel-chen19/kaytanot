export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, CheckCircle, Clock, Mail, Phone, Tent, Inbox, BarChart3 } from "lucide-react";

interface Camp {
  id: string;
  name: string;
  slug: string;
  city: string;
  is_active: boolean;
  created_at: string;
}

interface Lead {
  id: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  message: string | null;
  created_at: string;
  camp_id: string;
  camps: { name: string } | { name: string }[] | null;
}

function getCampName(camps: Lead["camps"]): string {
  if (!camps) return "פנייה כללית";
  if (Array.isArray(camps)) return camps[0]?.name ?? "—";
  return camps.name;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { success?: string; tab?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/dashboard");

  const { data: camps } = await supabase
    .from("camps")
    .select("id, name, slug, city, is_active, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const campIds = (camps ?? []).map((c: Camp) => c.id);

  const { data: leadsData } = campIds.length > 0
    ? await supabase
        .from("leads")
        .select("id, parent_name, parent_email, parent_phone, message, created_at, camp_id, camps(name)")
        .in("camp_id", campIds)
        .order("created_at", { ascending: false })
    : { data: [] as Lead[] };

  const campList  = (camps    ?? []) as Camp[];
  const leadList  = (leadsData ?? []) as Lead[];
  const activeTab = searchParams.tab ?? "camps";

  const stats = [
    { label: "קייטנות פעילות",    value: campList.filter(c => c.is_active).length,  icon: CheckCircle, color: "text-green-600",  bg: "bg-green-50"  },
    { label: "ממתינות לאישור",    value: campList.filter(c => !c.is_active).length, icon: Clock,       color: "text-[#F5C400]", bg: "bg-yellow-50" },
    { label: 'סה"כ פניות',        value: leadList.length,                            icon: BarChart3,   color: "text-[#003087]", bg: "bg-blue-50"   },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* Header */}
      <div className="bg-[#003087] py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">לוח הבקרה</h1>
            <p className="text-blue-200 text-sm mt-1">{user.email}</p>
          </div>
          <Link
            href="/publish"
            className="inline-flex items-center gap-2 bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black px-6 py-3 rounded-full transition-colors text-sm w-fit"
          >
            <Plus className="w-4 h-4" />
            פרסם קייטנה חדשה
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Success banner */}
        {searchParams.success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm font-medium">הקייטנה נשמרה בהצלחה! היא תפורסם לאחר אישור התשלום.</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className={`text-3xl font-black ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[{ key: "camps", label: "הקייטנות שלי", icon: Tent },
            { key: "leads", label: "פניות שהתקבלו", icon: Inbox }
          ].map(({ key, label, icon: Icon }) => (
            <Link
              key={key}
              href={`/dashboard?tab=${key}`}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                activeTab === key
                  ? "bg-[#003087] text-white"
                  : "bg-white text-[#003087] border border-[#e0e8f0] hover:border-[#003087]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* Camps tab */}
        {activeTab === "camps" && (
          campList.length > 0 ? (
            <div className="space-y-3">
              {campList.map((camp) => (
                <div key={camp.id} className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-[#003087] text-lg">{camp.name}</h3>
                    <p className="text-gray-500 text-sm">{camp.city}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {camp.is_active ? (
                      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" /> פעיל
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5" /> ממתין לאישור
                      </span>
                    )}
                    <Link
                      href={`/kaytana/${camp.slug}`}
                      className="border border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
                    >
                      צפה
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#e0e8f0] text-center">
              <div className="w-16 h-16 rounded-full bg-[#F5F7FA] flex items-center justify-center mb-4">
                <Tent className="w-8 h-8 text-[#003087]/30" />
              </div>
              <h3 className="text-xl font-black text-[#003087] mb-2">עדיין אין לך קייטנות</h3>
              <p className="text-gray-500 text-sm mb-6">פרסם את הקייטנה הראשונה שלך עכשיו!</p>
              <Link href="/publish" className="bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-black px-7 py-3 rounded-full transition-colors text-sm">
                פרסם קייטנה
              </Link>
            </div>
          )
        )}

        {/* Leads tab */}
        {activeTab === "leads" && (
          leadList.length > 0 ? (
            <div className="space-y-3">
              {leadList.map((lead) => (
                <div key={lead.id} className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-5">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <p className="font-black text-[#003087] text-lg">{lead.parent_name}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <a href={`mailto:${lead.parent_email}`} className="flex items-center gap-1.5 hover:text-[#003087] transition-colors">
                          <Mail className="w-4 h-4" />{lead.parent_email}
                        </a>
                        <a href={`tel:${lead.parent_phone}`} className="flex items-center gap-1.5 hover:text-[#003087] transition-colors">
                          <Phone className="w-4 h-4" />{lead.parent_phone}
                        </a>
                      </div>
                      {lead.message && (
                        <p className="text-sm text-gray-600 bg-[#F5F7FA] rounded-xl p-3 border border-[#e0e8f0]">
                          {lead.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-400 flex flex-col items-start md:items-end gap-1">
                      <span className="bg-[#003087]/10 text-[#003087] text-xs font-bold px-3 py-1 rounded-full">
                        {getCampName(lead.camps)}
                      </span>
                      <span>{new Date(lead.created_at).toLocaleDateString("he-IL")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#e0e8f0] text-center">
              <div className="w-16 h-16 rounded-full bg-[#F5F7FA] flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-[#003087]/30" />
              </div>
              <h3 className="text-xl font-black text-[#003087] mb-2">עדיין אין פניות</h3>
              <p className="text-gray-500 text-sm">פניות מהורים יופיעו כאן ברגע שהקייטנה שלך תפורסם.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
