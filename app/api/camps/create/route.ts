import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const campSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(1),
  description: z.string().min(10),
  age_min: z.coerce.number().min(3).max(18),
  age_max: z.coerce.number().min(3).max(18),
  price_basic: z.coerce.number().min(0).optional(),
  price_advanced: z.coerce.number().min(0).optional(),
  package_type: z.enum(["basic", "advanced"]),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w֐-׾-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "נדרשת התחברות" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = campSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "נתונים לא תקינים", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Generate unique slug
    const baseSlug = slugify(data.name) || `camp-${Date.now()}`;
    let slug = baseSlug;
    let attempt = 0;

    while (true) {
      const { data: existing } = await supabase
        .from("camps")
        .select("id")
        .eq("slug", slug)
        .single();

      if (!existing) break;
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    // Insert camp
    const { data: camp, error: campError } = await supabase
      .from("camps")
      .insert({
        name: data.name,
        slug,
        city: data.city,
        description: data.description,
        age_min: data.age_min,
        age_max: data.age_max,
        price_basic: data.price_basic ?? null,
        price_advanced: data.price_advanced ?? null,
        owner_id: user.id,
        is_active: false,
      })
      .select("id, slug")
      .single();

    if (campError || !camp) {
      console.error("Camp insert error:", campError);
      return NextResponse.json({ error: "שגיאה ביצירת הקייטנה" }, { status: 500 });
    }

    // Insert payment record
    const packagePrice = data.package_type === "basic" ? 299 : 599;
    await supabase.from("payments").insert({
      camp_id: camp.id,
      amount: packagePrice,
      package_type: data.package_type,
      status: "pending",
      // TODO: Integrate Cardcom payment gateway
      // After payment confirmation, update status to 'paid' and set camps.is_active = true
    });

    // Send onboarding email to owner
    await resend.emails.send({
      from: "קייטנות <noreply@kaytanot.co.il>",
      to: user.email!,
      subject: "ברוכים הבאים לקייטנות – הקייטנה שלך ממתינה לאישור",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1B4F72; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0;">🏕️ ברוכים הבאים לקייטנות!</h1>
          </div>
          <div style="background: #fff; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1A1A2E;">שלום,</h2>
            <p style="color: #4a5568; line-height: 1.6;">
              קיבלנו את פרטי הקייטנה <strong>${data.name}</strong> בהצלחה!
            </p>
            <div style="background: #fff8f5; border: 2px solid #FF6B35; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #FF6B35; margin-top: 0;">מה קורה עכשיו?</h3>
              <ol style="color: #4a5568; line-height: 1.8;">
                <li>השלימו את התשלום של ${packagePrice}₪ (חבילת ${data.package_type === "basic" ? "בסיסי" : "מתקדם"})</li>
                <li>לאחר אישור התשלום, הקייטנה שלכם תפורסם תוך 24 שעות</li>
                <li>הורים יוכלו למצוא אתכם ולשלוח פניות ישירות</li>
              </ol>
            </div>
            <p style="color: #4a5568;">
              בכל שאלה, פנו אלינו לכתובת info@kaytanot.co.il
            </p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard"
               style="display:inline-block; margin-top:10px; background:#FF6B35; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
              לוח הבקרה שלי
            </a>
          </div>
        </div>
      `,
    }).catch((err) => console.error("Onboarding email failed:", err));

    return NextResponse.json({ camp_id: camp.id, slug: camp.slug });
  } catch (err) {
    console.error("Create camp API error:", err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
