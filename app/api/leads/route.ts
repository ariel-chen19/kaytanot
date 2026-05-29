import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const leadSchema = z.object({
  camp_id:      z.string().uuid().optional(),
  parent_name:  z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  parent_email: z.string().email("כתובת אימייל אינה תקינה"),
  parent_phone: z.string().min(9, "מספר טלפון אינו תקין"),
  message:      z.string().optional(),
  // Extra fields from LeadFormSection (general inquiry)
  child_name:       z.string().optional(),
  last_name:        z.string().optional(),
  child_age:        z.number().optional(),
  preferred_track:  z.string().optional(),
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

    const {
      camp_id,
      parent_name,
      parent_email,
      parent_phone,
      message,
      child_name,
      last_name,
      child_age,
      preferred_track,
    } = parsed.data;

    const supabase = createClient();

    // Fetch camp name if camp_id provided
    let campName = "פנייה כללית";
    if (camp_id) {
      const { data: camp } = await supabase
        .from("camps")
        .select("id, name")
        .eq("id", camp_id)
        .single();
      if (!camp) {
        return NextResponse.json({ error: "הקייטנה לא נמצאה" }, { status: 404 });
      }
      campName = camp.name;
    }

    // Build message with extra fields if present
    const fullMessage = [
      message,
      child_name  ? `שם הילד: ${child_name} ${last_name ?? ""}`.trim() : null,
      child_age   ? `גיל: ${child_age}` : null,
      preferred_track ? `מסלול מועדף: ${preferred_track}` : null,
    ].filter(Boolean).join("\n") || null;

    // Insert lead
    const { error: insertError } = await supabase.from("leads").insert({
      camp_id:      camp_id ?? null,
      parent_name,
      parent_email,
      parent_phone,
      message:      fullMessage,
    });

    if (insertError) {
      console.error("Insert lead error:", insertError);
      return NextResponse.json({ error: "שגיאה בשמירת הפנייה" }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kaytanot.co.il";
    const adminEmail = process.env.ADMIN_EMAIL || "info@kaytanot.co.il";

    // Email to parent
    await resend.emails.send({
      from: "קייטנות <noreply@kaytanot.co.il>",
      to: parent_email,
      subject: camp_id ? `קיבלנו את פנייתך ל${campName}` : "קיבלנו את פנייתך — קייטנות",
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#003087;padding:30px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="color:white;margin:0;font-size:28px;">קייטנות</h1>
            <p style="color:#F5C400;margin:6px 0 0;font-size:14px;">הכיף שלהם מתחיל כאן</p>
          </div>
          <div style="background:#fff;padding:30px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;">
            <h2 style="color:#003087;">שלום ${parent_name},</h2>
            <p style="color:#4a5568;line-height:1.6;">
              תודה על פנייתך${camp_id ? ` לקייטנת <strong>${campName}</strong>` : ""}!<br>
              פנייתך התקבלה בהצלחה. נציג שלנו יצור קשר תוך 24 שעות.
            </p>
            <div style="background:#f7fafc;padding:20px;border-radius:8px;margin:20px 0;border-right:4px solid #F5C400;">
              <p><strong>שם:</strong> ${parent_name}</p>
              <p><strong>אימייל:</strong> ${parent_email}</p>
              <p><strong>טלפון:</strong> ${parent_phone}</p>
              ${fullMessage ? `<p><strong>פרטים נוספים:</strong><br>${fullMessage.replace(/\n/g, "<br>")}</p>` : ""}
            </div>
            <p style="color:#718096;font-size:14px;">בברכה,<br>צוות קייטנות</p>
          </div>
        </div>
      `,
    }).catch((err) => console.error("Email to parent failed:", err));

    // Email to admin
    await resend.emails.send({
      from: "קייטנות <noreply@kaytanot.co.il>",
      to: adminEmail,
      subject: `פנייה חדשה — ${campName}`,
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#003087;padding:30px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="color:white;margin:0;">פנייה חדשה התקבלה!</h1>
          </div>
          <div style="background:#fff;padding:30px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;">
            <h2 style="color:#003087;">${campName}</h2>
            <div style="background:#f7fafc;padding:20px;border-radius:8px;border-right:4px solid #F5C400;">
              <p><strong>שם:</strong> ${parent_name}</p>
              <p><strong>אימייל:</strong> <a href="mailto:${parent_email}">${parent_email}</a></p>
              <p><strong>טלפון:</strong> <a href="tel:${parent_phone}">${parent_phone}</a></p>
              ${fullMessage ? `<p><strong>פרטים:</strong><br>${fullMessage.replace(/\n/g, "<br>")}</p>` : ""}
            </div>
            <a href="${siteUrl}/dashboard"
               style="display:inline-block;margin-top:20px;background:#F5C400;color:#003087;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
              לוח הבקרה
            </a>
          </div>
        </div>
      `,
    }).catch((err) => console.error("Email to admin failed:", err));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Leads API error:", err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
