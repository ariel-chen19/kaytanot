import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const leadSchema = z.object({
  camp_id: z.string().uuid("מזהה קייטנה לא תקין"),
  parent_name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  parent_email: z.string().email("כתובת אימייל אינה תקינה"),
  parent_phone: z.string().min(9, "מספר טלפון אינו תקין"),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "נתונים לא תקינים", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { camp_id, parent_name, parent_email, parent_phone, message } = parsed.data;
    const supabase = createClient();

    // Fetch camp + owner email
    const { data: camp, error: campError } = await supabase
      .from("camps")
      .select("id, name, owner_id, is_active")
      .eq("id", camp_id)
      .single();

    if (campError || !camp) {
      return NextResponse.json({ error: "הקייטנה לא נמצאה" }, { status: 404 });
    }

    // Insert lead
    const { error: insertError } = await supabase.from("leads").insert({
      camp_id,
      parent_name,
      parent_email,
      parent_phone,
      message: message || null,
    });

    if (insertError) {
      console.error("Insert lead error:", insertError);
      return NextResponse.json({ error: "שגיאה בשמירת הפנייה" }, { status: 500 });
    }

    // Send email to parent (confirmation)
    await resend.emails.send({
      from: "קייטנות <noreply@kaytanot.co.il>",
      to: parent_email,
      subject: `קיבלנו את פנייתך ל${camp.name}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1B4F72; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0;">🏕️ קייטנות</h1>
          </div>
          <div style="background: #fff; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1A1A2E;">שלום ${parent_name},</h2>
            <p style="color: #4a5568; line-height: 1.6;">
              תודה על פנייתך לקייטנת <strong>${camp.name}</strong>!<br>
              פנייתך התקבלה בהצלחה. בעל הקייטנה יצור קשר בהקדם.
            </p>
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1B4F72; margin-top: 0;">פרטי הפנייה:</h3>
              <p><strong>קייטנה:</strong> ${camp.name}</p>
              <p><strong>שם:</strong> ${parent_name}</p>
              <p><strong>אימייל:</strong> ${parent_email}</p>
              <p><strong>טלפון:</strong> ${parent_phone}</p>
              ${message ? `<p><strong>הודעה:</strong> ${message}</p>` : ""}
            </div>
            <p style="color: #718096; font-size: 14px;">
              בברכה,<br>
              צוות קייטנות
            </p>
          </div>
        </div>
      `,
    }).catch((err) => console.error("Email to parent failed:", err));

    // Send notification to camp owner (via admin lookup or fallback)
    // Note: In production, store owner_email in camps table or use a server-side lookup
    // For now we send to a configured admin email as well
    const siteEmail = process.env.ADMIN_EMAIL || "info@kaytanot.co.il";
    await resend.emails.send({
      from: "קייטנות <noreply@kaytanot.co.il>",
      to: siteEmail,
      subject: `🏕️ פנייה חדשה – ${camp.name}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #FF6B35; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0;">פנייה חדשה התקבלה!</h1>
          </div>
          <div style="background: #fff; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1A1A2E;">קייטנה: ${camp.name}</h2>
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1B4F72; margin-top: 0;">פרטי ההורה:</h3>
              <p><strong>שם:</strong> ${parent_name}</p>
              <p><strong>אימייל:</strong> <a href="mailto:${parent_email}">${parent_email}</a></p>
              <p><strong>טלפון:</strong> <a href="tel:${parent_phone}">${parent_phone}</a></p>
              ${message ? `<p><strong>הודעה:</strong> ${message}</p>` : ""}
            </div>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard"
               style="display:inline-block; margin-top:20px; background:#FF6B35; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
              לוח הבקרה
            </a>
          </div>
        </div>
      `,
    }).catch((err) => console.error("Email to owner failed:", err));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Leads API error:", err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
