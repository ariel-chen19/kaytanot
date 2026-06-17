export const dynamic = 'force-dynamic';

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Plus, CheckCircle, Clock, Mail, MessageCircle, Phone, Tent, Inbox, BarChart3, CalendarDays, Settings, Save, FileSpreadsheet, Webhook, Search, Filter } from "lucide-react";

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
  camp_id: string | null;
  status?: string | null;
  source?: string | null;
  source_page?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  camps: { name: string; slug?: string | null; city?: string | null } | { name: string; slug?: string | null; city?: string | null }[] | null;
}

interface LeadSettings {
  camp_id: string;
  google_sheets_enabled: boolean;
  google_sheet_id: string | null;
  google_sheet_tab_name: string | null;
  owner_whatsapp: string | null;
  whatsapp_digest_frequency: string;
  internal_crm_enabled: boolean;
  external_webhook_url: string | null;
}

const leadStatusLabels: Record<string, string> = {
  new: "חדש",
  contacted: "טופל",
  closed: "נסגר",
  irrelevant: "לא רלוונטי",
};

function normalizeLeadStatus(value: FormDataEntryValue | string | null): string {
  if (typeof value !== "string") return "new";
  return Object.prototype.hasOwnProperty.call(leadStatusLabels, value) ? value : "new";
}

function getAdminEmails(): string[] {
  return [
    process.env.ADMIN_EMAIL,
    "ariel.kaytanot@gmail.com",
  ].filter(Boolean).map((email) => email!.toLowerCase());
}

function cleanOptionalText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function saveLeadSettings(formData: FormData) {
  "use server";

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?redirect=${encodeURIComponent("/dashboard?tab=settings")}`);

  const isSiteAdmin = getAdminEmails().includes(user.email?.toLowerCase() ?? "");
  const dataClient = isSiteAdmin ? createAdminClient() : supabase;
  const campId = cleanOptionalText(formData.get("camp_id"));

  if (!campId) redirect("/dashboard?tab=settings&settings=missing-camp");

  const { data: camp } = isSiteAdmin
    ? await dataClient
        .from("camps")
        .select("id")
        .eq("id", campId)
        .maybeSingle()
    : await dataClient
        .from("camps")
        .select("id")
        .eq("id", campId)
        .eq("owner_id", user.id)
        .maybeSingle();

  if (!camp) redirect("/dashboard?tab=settings&settings=unauthorized");

  const frequency = cleanOptionalText(formData.get("whatsapp_digest_frequency")) ?? "none";
  const allowedFrequencies = new Set(["none", "immediate", "daily"]);
  const externalCrmEnabled = formData.get("external_crm_enabled") === "on";

  const { error } = await dataClient.from("camp_lead_settings").upsert({
    camp_id: campId,
    google_sheets_enabled: formData.get("google_sheets_enabled") === "on",
    google_sheet_id: cleanOptionalText(formData.get("google_sheet_id")),
    google_sheet_tab_name: cleanOptionalText(formData.get("google_sheet_tab_name")) ?? "Leads",
    owner_whatsapp: cleanOptionalText(formData.get("owner_whatsapp")),
    whatsapp_digest_frequency: allowedFrequencies.has(frequency) ? frequency : "none",
    internal_crm_enabled: formData.get("internal_crm_enabled") === "on",
    external_webhook_url: externalCrmEnabled ? cleanOptionalText(formData.get("external_webhook_url")) : null,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: "camp_id",
  });

  if (error) redirect("/dashboard?tab=settings&settings=error");

  revalidatePath("/dashboard");
  redirect("/dashboard?tab=settings&settings=saved");
}

async function updateLeadStatus(formData: FormData) {
  "use server";

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?redirect=${encodeURIComponent("/dashboard?tab=leads")}`);

  const isSiteAdmin = getAdminEmails().includes(user.email?.toLowerCase() ?? "");
  const dataClient = isSiteAdmin ? createAdminClient() : supabase;
  const leadId = cleanOptionalText(formData.get("lead_id"));
  const status = normalizeLeadStatus(formData.get("status"));

  if (!leadId) redirect("/dashboard?tab=leads&leadStatus=missing-lead");

  const { error } = await dataClient
    .from("leads")
    .update({ status })
    .eq("id", leadId);

  if (error) redirect("/dashboard?tab=leads&leadStatus=error");

  revalidatePath("/dashboard");
  redirect("/dashboard?tab=leads&leadStatus=saved");
}

function getCampName(camps: Lead["camps"]): string {
  if (!camps) return "פנייה כללית";
  if (Array.isArray(camps)) return camps[0]?.name ?? "-";
  return camps.name;
}

function getCampMeta(camps: Lead["camps"]): { slug?: string | null; city?: string | null } {
  if (!camps) return {};
  const camp = Array.isArray(camps) ? camps[0] : camps;
  return { slug: camp?.slug, city: camp?.city };
}

function isRecent(date: string, days: number): boolean {
  return new Date(date).getTime() >= Date.now() - days * 24 * 60 * 60 * 1000;
}

function isToday(date: string): boolean {
  return new Date(date).toDateString() === new Date().toDateString();
}

function isPlaceholderEmail(email: string): boolean {
  return email.endsWith("@phone.kaytanot.local");
}

function toWhatsappPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("972")) return digits;
  if (digits.startsWith("0")) return `972${digits.slice(1)}`;
  return digits;
}

function leadMatchesSearch(lead: Lead, query: string): boolean {
  if (!query) return true;
  const haystack = [
    lead.parent_name,
    lead.parent_email,
    lead.parent_phone,
    lead.message ?? "",
    getCampName(lead.camps),
    getCampMeta(lead.camps).city ?? "",
  ].join(" ").toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { success?: string; tab?: string; settings?: string; q?: string; camp?: string; status?: string; leadStatus?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const requestedTab = searchParams.tab;

  if (!user) {
    const redirectTo = requestedTab ? `/dashboard?tab=${encodeURIComponent(requestedTab)}` : "/dashboard";
    redirect(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`);
  }

  const isSiteAdmin = getAdminEmails().includes(user.email?.toLowerCase() ?? "");
  const dataClient = isSiteAdmin ? createAdminClient() : supabase;

  const campsQuery = dataClient
    .from("camps")
    .select("id, name, slug, city, is_active, created_at")
    .order("created_at", { ascending: false });

  const { data: camps } = isSiteAdmin
    ? await campsQuery
    : await campsQuery.eq("owner_id", user.id);

  const campIds = (camps ?? []).map((c: Camp) => c.id);

  const leadsSelect = "id, parent_name, parent_email, parent_phone, message, created_at, camp_id, status, source, source_page, utm_source, utm_medium, utm_campaign, camps(name, slug, city)";
  const { data: leadsData } = isSiteAdmin
    ? await dataClient
        .from("leads")
        .select(leadsSelect)
        .order("created_at", { ascending: false })
        .limit(300)
    : campIds.length > 0
      ? await dataClient
          .from("leads")
          .select(leadsSelect)
          .in("camp_id", campIds)
          .order("created_at", { ascending: false })
          .limit(300)
      : { data: [] as Lead[] };

  const campList  = (camps    ?? []) as Camp[];
  const leadList  = (leadsData ?? []) as Lead[];
  const selectedCampId = searchParams.camp ?? "all";
  const selectedStatus = searchParams.status ?? "all";
  const leadSearchQuery = (searchParams.q ?? "").trim();
  const visibleLeadList = leadList.filter((lead) => {
    const campMatches = selectedCampId === "all" || lead.camp_id === selectedCampId;
    const statusMatches = selectedStatus === "all" || (lead.status ?? "new") === selectedStatus;
    return campMatches && statusMatches && leadMatchesSearch(lead, leadSearchQuery);
  });
  const { data: leadSettingsData } = campIds.length > 0
    ? await dataClient
        .from("camp_lead_settings")
        .select("camp_id, google_sheets_enabled, google_sheet_id, google_sheet_tab_name, owner_whatsapp, whatsapp_digest_frequency, internal_crm_enabled, external_webhook_url")
        .in("camp_id", campIds)
    : { data: [] as LeadSettings[] };
  const settingsByCampId = new Map(
    ((leadSettingsData ?? []) as LeadSettings[]).map((settings) => [settings.camp_id, settings])
  );
  const activeTab = requestedTab ?? (isSiteAdmin ? "leads" : "camps");

  const stats = [
    { label: isSiteAdmin ? "קייטנות פעילות" : "קייטנות פעילות", value: campList.filter(c => c.is_active).length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "פניות היום", value: leadList.filter(lead => isToday(lead.created_at)).length, icon: CalendarDays, color: "text-[#F5C400]", bg: "bg-yellow-50" },
    { label: "פניות ב-30 ימים", value: leadList.filter(lead => isRecent(lead.created_at, 30)).length, icon: BarChart3, color: "text-[#003087]", bg: "bg-blue-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* Header */}
      <div className="bg-[#003087] py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">
              {isSiteAdmin ? "ניהול לידים וקייטנות" : "לוח הבקרה"}
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              {isSiteAdmin ? "תצוגת מנהל האתר - כל הפניות מכל עמודי הנחיתה" : user.email}
            </p>
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
          {[{ key: "camps", label: isSiteAdmin ? "כל הקייטנות" : "הקייטנות שלי", icon: Tent },
            { key: "leads", label: isSiteAdmin ? "כל הלידים" : "פניות שהתקבלו", icon: Inbox },
            { key: "settings", label: "הגדרות לידים", icon: Settings }
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

        {/* Lead settings tab */}
        {activeTab === "settings" && (
          campList.length > 0 ? (
            <div className="space-y-5">
              {searchParams.settings === "saved" && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm font-medium">הגדרות הלידים נשמרו בהצלחה.</p>
                </div>
              )}
              {searchParams.settings === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm font-medium">
                  לא הצלחנו לשמור את ההגדרות. כדאי לבדוק הרשאות או לנסות שוב.
                </div>
              )}

              {campList.map((camp) => {
                const settings = settingsByCampId.get(camp.id);
                const externalCrmEnabled = Boolean(settings?.external_webhook_url);

                return (
                  <form key={camp.id} action={saveLeadSettings} className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-5 space-y-5">
                    <input type="hidden" name="camp_id" value={camp.id} />
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h3 className="font-black text-[#003087] text-lg">{camp.name}</h3>
                        <p className="text-gray-500 text-sm">{camp.city}</p>
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 bg-[#003087] hover:bg-[#00266d] text-white font-black px-5 py-2.5 rounded-full transition-colors text-sm w-fit"
                      >
                        <Save className="w-4 h-4" />
                        שמור הגדרות
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-[#e0e8f0] bg-[#F5F7FA] p-4 space-y-3">
                        <div className="flex items-center gap-2 text-[#003087] font-black">
                          <MessageCircle className="w-5 h-5" />
                          וואטסאפ לבעל הקייטנה
                        </div>
                        <label className="block text-sm font-bold text-gray-700">
                          מספר וואטסאפ
                          <input
                            name="owner_whatsapp"
                            defaultValue={settings?.owner_whatsapp ?? ""}
                            placeholder="054-302-4343"
                            className="mt-1 w-full rounded-xl border border-[#d7e1ea] bg-white px-4 py-3 text-sm outline-none focus:border-[#003087]"
                          />
                        </label>
                        <label className="block text-sm font-bold text-gray-700">
                          תדירות שליחה
                          <select
                            name="whatsapp_digest_frequency"
                            defaultValue={settings?.whatsapp_digest_frequency ?? "none"}
                            className="mt-1 w-full rounded-xl border border-[#d7e1ea] bg-white px-4 py-3 text-sm outline-none focus:border-[#003087]"
                          >
                            <option value="none">כבוי</option>
                            <option value="immediate">מיידי</option>
                            <option value="daily">סיכום יומי</option>
                          </select>
                        </label>
                      </div>

                      <div className="rounded-xl border border-[#e0e8f0] bg-[#F5F7FA] p-4 space-y-3">
                        <div className="flex items-center gap-2 text-[#003087] font-black">
                          <FileSpreadsheet className="w-5 h-5" />
                          Google Sheets
                        </div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                          <input
                            type="checkbox"
                            name="google_sheets_enabled"
                            defaultChecked={settings?.google_sheets_enabled ?? false}
                            className="h-4 w-4 rounded border-gray-300 text-[#003087]"
                          />
                          הפעל שליחה לגוגל שיטס
                        </label>
                        <label className="block text-sm font-bold text-gray-700">
                          מזהה גיליון
                          <input
                            name="google_sheet_id"
                            defaultValue={settings?.google_sheet_id ?? ""}
                            placeholder="Google Sheet ID"
                            className="mt-1 w-full rounded-xl border border-[#d7e1ea] bg-white px-4 py-3 text-sm outline-none focus:border-[#003087]"
                          />
                        </label>
                        <label className="block text-sm font-bold text-gray-700">
                          שם לשונית
                          <input
                            name="google_sheet_tab_name"
                            defaultValue={settings?.google_sheet_tab_name ?? "Leads"}
                            className="mt-1 w-full rounded-xl border border-[#d7e1ea] bg-white px-4 py-3 text-sm outline-none focus:border-[#003087]"
                          />
                        </label>
                      </div>

                      <div className="rounded-xl border border-[#e0e8f0] bg-[#F5F7FA] p-4 space-y-3">
                        <div className="flex items-center gap-2 text-[#003087] font-black">
                          <Inbox className="w-5 h-5" />
                          CRM פנימי
                        </div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                          <input
                            type="checkbox"
                            name="internal_crm_enabled"
                            defaultChecked={settings?.internal_crm_enabled ?? false}
                            className="h-4 w-4 rounded border-gray-300 text-[#003087]"
                          />
                          הפעל ניהול לידים פנימי בדשבורד
                        </label>
                        <p className="text-xs text-gray-500">הלידים נשמרים תמיד במערכת. הסימון הזה ישמש להפעלת יכולות CRM פנימיות בהמשך.</p>
                      </div>

                      <div className="rounded-xl border border-[#e0e8f0] bg-[#F5F7FA] p-4 space-y-3">
                        <div className="flex items-center gap-2 text-[#003087] font-black">
                          <Webhook className="w-5 h-5" />
                          CRM חיצוני
                        </div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                          <input
                            type="checkbox"
                            name="external_crm_enabled"
                            defaultChecked={externalCrmEnabled}
                            className="h-4 w-4 rounded border-gray-300 text-[#003087]"
                          />
                          הפעל שליחה ל-CRM חיצוני
                        </label>
                        <label className="block text-sm font-bold text-gray-700">
                          Webhook URL
                          <input
                            name="external_webhook_url"
                            defaultValue={settings?.external_webhook_url ?? ""}
                            placeholder="https://example.com/webhook"
                            className="mt-1 w-full rounded-xl border border-[#d7e1ea] bg-white px-4 py-3 text-sm outline-none focus:border-[#003087]"
                          />
                        </label>
                      </div>
                    </div>
                  </form>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#e0e8f0] text-center">
              <div className="w-16 h-16 rounded-full bg-[#F5F7FA] flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-[#003087]/30" />
              </div>
              <h3 className="text-xl font-black text-[#003087] mb-2">אין קייטנות להגדרה</h3>
              <p className="text-gray-500 text-sm">אחרי שתהיה קייטנה פעילה, אפשר יהיה להגדיר איך הלידים נשלחים.</p>
            </div>
          )
        )}

        {/* Leads tab */}
        {activeTab === "leads" && (
          leadList.length > 0 ? (
            <div className="space-y-4">
              {searchParams.leadStatus === "saved" && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm font-medium">סטטוס הליד עודכן בהצלחה.</p>
                </div>
              )}
              {searchParams.leadStatus === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm font-medium">
                  לא הצלחנו לעדכן את סטטוס הליד. כדאי לבדוק הרשאות או לנסות שוב.
                </div>
              )}

              <form method="get" className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-4">
                <input type="hidden" name="tab" value="leads" />
                <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_auto] gap-3">
                  <label className="relative block">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="q"
                      defaultValue={leadSearchQuery}
                      placeholder="חיפוש לפי שם, טלפון, אימייל או הודעה"
                      className="w-full rounded-full border border-[#d7e1ea] bg-[#F5F7FA] py-3 pr-11 pl-4 text-sm outline-none focus:border-[#003087]"
                    />
                  </label>
                  <label className="relative block">
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      name="camp"
                      defaultValue={selectedCampId}
                      className="w-full appearance-none rounded-full border border-[#d7e1ea] bg-[#F5F7FA] py-3 pr-11 pl-4 text-sm outline-none focus:border-[#003087]"
                    >
                      <option value="all">כל הקייטנות</option>
                      {campList.map((camp) => (
                        <option key={camp.id} value={camp.id}>{camp.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="relative block">
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      name="status"
                      defaultValue={selectedStatus}
                      className="w-full appearance-none rounded-full border border-[#d7e1ea] bg-[#F5F7FA] py-3 pr-11 pl-4 text-sm outline-none focus:border-[#003087]"
                    >
                      <option value="all">כל הסטטוסים</option>
                      {Object.entries(leadStatusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-[#003087] hover:bg-[#00266d] text-white font-black px-6 py-3 rounded-full transition-colors text-sm">
                      סנן
                    </button>
                    <Link href="/dashboard?tab=leads" className="border border-[#d7e1ea] bg-white hover:bg-[#F5F7FA] text-[#003087] font-bold px-5 py-3 rounded-full transition-colors text-sm">
                      נקה
                    </Link>
                  </div>
                </div>
              </form>

              {visibleLeadList.length === 0 && (
                <div className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-8 text-center">
                  <h3 className="text-xl font-black text-[#003087] mb-2">לא נמצאו לידים בסינון הזה</h3>
                  <p className="text-gray-500 text-sm">אפשר לנקות סינון או לחפש ביטוי אחר.</p>
                </div>
              )}

              {visibleLeadList.map((lead) => {
                const campMeta = getCampMeta(lead.camps);
                const currentStatus = normalizeLeadStatus(lead.status ?? "new");
                return (
                <div key={lead.id} className="bg-white rounded-2xl border border-[#e0e8f0] shadow-sm p-5">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-3 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black text-[#003087] text-lg">{lead.parent_name}</p>
                        <span className="bg-[#003087]/10 text-[#003087] text-xs font-bold px-3 py-1 rounded-full">
                          {getCampName(lead.camps)}
                        </span>
                        {campMeta.city && (
                          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                            {campMeta.city}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {isPlaceholderEmail(lead.parent_email) ? (
                          <span className="flex items-center gap-1.5 text-gray-400">
                            <Mail className="w-4 h-4" />לא נמסר אימייל
                          </span>
                        ) : (
                          <a href={`mailto:${lead.parent_email}`} className="flex items-center gap-1.5 hover:text-[#003087] transition-colors">
                            <Mail className="w-4 h-4" />{lead.parent_email}
                          </a>
                        )}
                        <a href={`tel:${lead.parent_phone}`} className="flex items-center gap-1.5 hover:text-[#003087] transition-colors">
                          <Phone className="w-4 h-4" />{lead.parent_phone}
                        </a>
                        <a
                          href={`https://wa.me/${toWhatsappPhone(lead.parent_phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-green-600 hover:text-green-700 transition-colors font-bold"
                        >
                          <MessageCircle className="w-4 h-4" />פתיחה בוואטסאפ
                        </a>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                        <span>סטטוס: {leadStatusLabels[currentStatus]}</span>
                        <span>מקור: {lead.source === "landing_form" || !lead.source ? "טופס עמוד נחיתה" : lead.source}</span>
                        {lead.source_page && (
                          <a
                            href={lead.source_page}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#003087] hover:underline"
                          >
                            פתיחת מקור הפנייה
                          </a>
                        )}
                      </div>
                      {lead.message && (
                        <p className="text-sm text-gray-600 bg-[#F5F7FA] rounded-xl p-3 border border-[#e0e8f0]">
                          {lead.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-400 flex flex-col items-start md:items-end gap-2">
                      <span>{new Date(lead.created_at).toLocaleDateString("he-IL")}</span>
                      <span>{new Date(lead.created_at).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</span>
                      <form action={updateLeadStatus} className="flex items-center gap-2 mt-1">
                        <input type="hidden" name="lead_id" value={lead.id} />
                        <select
                          name="status"
                          defaultValue={currentStatus}
                          className="rounded-full border border-[#d7e1ea] bg-[#F5F7FA] px-3 py-2 text-xs font-bold text-[#003087] outline-none focus:border-[#003087]"
                        >
                          {Object.entries(leadStatusLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <button type="submit" className="bg-[#003087] hover:bg-[#00266d] text-white font-bold px-3 py-2 rounded-full transition-colors text-xs">
                          עדכן
                        </button>
                      </form>
                      {campMeta.slug && (
                        <Link
                          href={`/kaytana/${campMeta.slug}`}
                          className="text-[#003087] hover:underline font-bold"
                        >
                          צפייה בעמוד
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
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
