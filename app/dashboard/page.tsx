export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CheckCircle, Clock, Mail, Phone } from "lucide-react";

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
  if (!camps) return "—";
  if (Array.isArray(camps)) return camps[0]?.name ?? "—";
  return camps.name;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

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

  const campList = (camps ?? []) as Camp[];
  const leadList = (leadsData ?? []) as Lead[];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A2E]">לוח הבקרה</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <Link href="/publish">
          <Button className="bg-[#FF6B35] hover:bg-[#e55a27] text-white gap-2 rounded-xl">
            <Plus className="w-4 h-4" />
            פרסם קייטנה חדשה
          </Button>
        </Link>
      </div>

      {searchParams.success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p>הקייטנה נשמרה בהצלחה! היא תפורסם לאחר אישור התשלום.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">קייטנות פעילות</p>
            <p className="text-4xl font-extrabold text-[#1B4F72]">
              {campList.filter((c) => c.is_active).length}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">ממתינות לאישור</p>
            <p className="text-4xl font-extrabold text-[#FF6B35]">
              {campList.filter((c) => !c.is_active).length}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">סה&quot;כ פניות</p>
            <p className="text-4xl font-extrabold text-green-600">
              {leadList.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="camps" dir="rtl">
        <TabsList className="mb-6">
          <TabsTrigger value="camps">הקייטנות שלי</TabsTrigger>
          <TabsTrigger value="leads">פניות שהתקבלו</TabsTrigger>
        </TabsList>

        <TabsContent value="camps">
          {campList.length > 0 ? (
            <div className="space-y-3">
              {campList.map((camp) => (
                <Card key={camp.id} className="rounded-2xl">
                  <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5">
                    <div>
                      <h3 className="font-bold text-lg">{camp.name}</h3>
                      <p className="text-muted-foreground text-sm">{camp.city}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {camp.is_active ? (
                        <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          פעיל
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          ממתין לאישור
                        </Badge>
                      )}
                      <Link href={`/camps/${camp.slug}`}>
                        <Button variant="outline" size="sm">צפה</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-border">
              <span className="text-6xl mb-4 block">🏕️</span>
              <h3 className="text-xl font-bold mb-2">עדיין אין לך קייטנות</h3>
              <p className="text-muted-foreground mb-6">פרסם את הקייטנה הראשונה שלך עכשיו!</p>
              <Link href="/publish">
                <Button className="bg-[#FF6B35] hover:bg-[#e55a27] text-white">פרסם קייטנה</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leads">
          {leadList.length > 0 ? (
            <div className="space-y-3">
              {leadList.map((lead) => (
                <Card key={lead.id} className="rounded-2xl">
                  <CardContent className="py-5">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-bold text-lg">{lead.parent_name}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {lead.parent_email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {lead.parent_phone}
                          </span>
                        </div>
                        {lead.message && (
                          <p className="text-sm text-foreground/70 mt-2 bg-gray-50 rounded-lg p-3">
                            {lead.message}
                          </p>
                        )}
                      </div>
                      <div className="text-left md:text-right text-sm text-muted-foreground flex-shrink-0">
                        <Badge variant="outline" className="mb-1">{getCampName(lead.camps)}</Badge>
                        <p>{new Date(lead.created_at).toLocaleDateString("he-IL")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-border">
              <span className="text-6xl mb-4 block">📬</span>
              <h3 className="text-xl font-bold mb-2">עדיין אין פניות</h3>
              <p className="text-muted-foreground">פניות מהורים יופיעו כאן ברגע שהקייטנה שלך תפורסם.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
