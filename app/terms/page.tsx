import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "תקנון אתר",
  description: "תקנון השימוש באתר קייטנות, כולל שימוש באתר, פניות, מידע, אחריות ותנאי שירות.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const sections = [
    {
      title: "כללי",
      text: "האתר קייטנות מספק מידע על קייטנות, עמודי נחיתה, טפסי פנייה ושירותי פרסום למפעילי קייטנות. השימוש באתר מהווה הסכמה לתקנון זה.",
    },
    {
      title: "מידע באתר",
      text: "אנו עושים מאמץ להציג מידע מדויק ועדכני, אך ייתכנו שינויים במחירים, מחזורים, ערים, פעילויות ותנאי הרשמה. האחריות לאימות הפרטים הסופיים מול מפעיל הקייטנה היא של המשתמש.",
    },
    {
      title: "פניות ולידים",
      text: "בעת השארת פרטים באתר, המידע עשוי להימסר למפעיל הקייטנה הרלוונטי לצורך יצירת קשר ומתן מידע. אין התחייבות לכך שהפנייה תוביל להרשמה או לשמירת מקום.",
    },
    {
      title: "פרסום קייטנות",
      text: "בעל קייטנה שמוסר מידע לפרסום מצהיר כי הפרטים שמסר נכונים, כי יש לו זכות להשתמש בתמונות ובלוגואים, וכי הוא אחראי לעמוד בכל דין, אישור, ביטוח או תקן הנדרש להפעלת הקייטנה.",
    },
    {
      title: "הטבות ומבצעים",
      text: "הטבות, מחירים מיוחדים וסבסודים עשויים להשתנות לפי ארגון, חברה, ועד עובדים או תנאי ספק. אין לראות בפרסום הטבה התחייבות לזכאות עד לאישור סופי מול הגורם הרלוונטי.",
    },
    {
      title: "הגבלת אחריות",
      text: "האתר אינו מפעיל את הקייטנות ואינו אחראי לפעילות בפועל, לבטיחות, לתוכן, להסעות או לכל שירות שמסופק על ידי צד שלישי. האתר משמש כפלטפורמת מידע וחיבור בלבד.",
    },
    {
      title: "שינויים בתקנון",
      text: "אנו רשאים לעדכן את התקנון מעת לעת. נוסח התקנון המעודכן באתר הוא הנוסח המחייב.",
    },
  ];

  return (
    <div className="bg-[#f5f8fc] px-4 py-10">
      <article className="mx-auto max-w-4xl rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-xl shadow-[#003087]/10 md:p-10">
        <h1 className="font-heebo text-4xl font-black text-[#182e86]">תקנון אתר</h1>
        <div className="mb-7 mt-3 h-1 w-12 rounded-full bg-[#F5C400]" />
        <p className="mb-8 text-sm text-slate-500">עודכן לאחרונה: 17 ביוני 2026</p>
        <div className="space-y-7">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-heebo text-2xl font-black text-[#182e86]">{section.title}</h2>
              <p className="mt-2 text-lg leading-8 text-slate-700">{section.text}</p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
