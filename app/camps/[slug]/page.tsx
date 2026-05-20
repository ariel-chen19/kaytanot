export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactForm from "@/components/ContactForm";

interface CampPageProps {
  params: { slug: string };
}

export default async function CampPage({ params }: CampPageProps) {
  const supabase = createClient();

  const { data: camp } = await supabase
    .from("camps")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!camp) notFound();

  return (
    <div>
      {/* Hero Image */}
      <div
        className="w-full h-64 md:h-96 bg-gradient-to-br from-[#FF6B35] to-[#1B4F72] flex items-center justify-center relative overflow-hidden"
      >
        {camp.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={camp.image_url}
            alt={camp.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-8xl opacity-40">🏕️</span>
        )}
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-4">{camp.name}</h1>
              <div className="flex flex-wrap gap-3">
                <Badge className="flex items-center gap-1 bg-blue-100 text-[#1B4F72] px-3 py-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  {camp.city}
                </Badge>
                <Badge className="flex items-center gap-1 bg-orange-100 text-[#FF6B35] px-3 py-1 text-sm">
                  <Users className="w-4 h-4" />
                  גילאי {camp.age_min}–{camp.age_max}
                </Badge>
              </div>
            </div>

            {camp.description && (
              <div>
                <h2 className="text-xl font-bold mb-3">על הקייטנה</h2>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{camp.description}</p>
              </div>
            )}

            {/* Pricing */}
            {(camp.price_basic || camp.price_advanced) && (
              <div>
                <h2 className="text-xl font-bold mb-4">תוכניות ומחירים</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {camp.price_basic && (
                    <Card className="rounded-2xl border-2 border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">תוכנית בסיסית</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-extrabold text-[#FF6B35] mb-4">
                          {camp.price_basic.toLocaleString("he-IL")} ₪
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> כניסה לכל הפעילויות</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> ציוד בסיסי כלול</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> ליווי מקצועי</li>
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  {camp.price_advanced && (
                    <Card className="rounded-2xl border-2 border-[#FF6B35] relative overflow-hidden">
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-[#FF6B35] text-white text-xs">מומלץ</Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">תוכנית מתקדמת</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-extrabold text-[#FF6B35] mb-4">
                          {camp.price_advanced.toLocaleString("he-IL")} ₪
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> כל הכלול בבסיסי</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> ציוד מתקדם</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> הדרכה אישית</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> אירועי בונוס</li>
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <Card className="rounded-2xl shadow-lg sticky top-20">
              <CardHeader>
                <CardTitle className="text-xl">שלח פנייה לקייטנה</CardTitle>
                <p className="text-sm text-muted-foreground">מלאו את הפרטים ונחזור אליכם בהקדם</p>
              </CardHeader>
              <CardContent>
                <ContactForm campId={camp.id} campName={camp.name} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
