import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  description: "מדיניות הפרטיות של אתר קייטנות בנוגע לפניות והרשמה לקייטנות.",
  alternates: {
    canonical: "https://www.kaytanot.co.il/privacy",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f5f8fc] px-4 py-8 text-slate-800 md:py-14">
      <article className="mx-auto max-w-4xl rounded-2xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:p-10">
        <h1 className="font-heebo text-3xl font-black text-[#182e86] md:text-4xl">
          מדיניות פרטיות
        </h1>
        <div className="mb-6 mt-2 h-1 w-12 rounded-full bg-[#F5C400]" />
        <p className="mb-7 text-sm text-slate-500">עודכן לאחרונה: 15 ביוני 2026</p>

        <div className="space-y-7 text-base leading-8">
          <section>
            <h2 className="font-heebo text-xl font-black text-[#182e86]">איזה מידע נאסף?</h2>
            <p>
              בעת השארת פרטים באתר אנו אוספים את המידע שמסרתם, כגון שם, מספר טלפון,
              כתובת דוא״ל והודעה. בנוסף עשוי להישמר מידע טכני בסיסי על עמוד הפנייה
              ומקור ההגעה אליו.
            </p>
          </section>

          <section>
            <h2 className="font-heebo text-xl font-black text-[#182e86]">למה משמש המידע?</h2>
            <p>
              המידע משמש לטיפול בפנייה, מסירת פרטים על הקייטנה, בדיקת זמינות,
              יצירת קשר, תפעול מערכת הלידים ושיפור השירות. מסירת המידע אינה חובה
              על פי חוק, אך ללא פרטי קשר לא נוכל לחזור אליכם.
            </p>
          </section>

          <section>
            <h2 className="font-heebo text-xl font-black text-[#182e86]">
              Google Analytics ועוגיות מדידה
            </h2>
            <p>
              האתר משתמש ב-Google Consent Mode כשהרשאת המדידה מוגדרת כברירת
              מחדל כנדחית. במצב זה לא נשמרות עוגיות Analytics. רק לאחר קבלת
              הסכמה מופעלת מדידה מלאה של צפיות ופעולות באתר, כגון שליחת טופס,
              לחיצה על WhatsApp והורדת תוכנית קייטנה. איננו מפעילים עוגיות
              פרסום, וניתן לשנות את הבחירה בכל עת באמצעות הכפתור
              &quot;הגדרות פרטיות&quot; באתר.
            </p>
          </section>

          <section>
            <h2 className="font-heebo text-xl font-black text-[#182e86]">למי המידע עשוי להימסר?</h2>
            <p>
              המידע עשוי להימסר לצוות המפעיל את הקייטנה ולספקים טכנולוגיים הנדרשים
              להפעלת האתר ולטיפול בפניות, כגון שירותי אחסון, מסד נתונים, דוא״ל
              וגיליונות ניהול. המידע לא יימכר לצדדים שלישיים.
            </p>
          </section>

          <section>
            <h2 className="font-heebo text-xl font-black text-[#182e86]">שמירה ואבטחת מידע</h2>
            <p>
              אנו נוקטים אמצעים סבירים להגנת המידע ושומרים אותו למשך הזמן הנדרש
              לטיפול בפנייה, לניהול השירות ולעמידה בחובות החלות עלינו. אין מערכת
              מאובטחת באופן מוחלט, ולכן לא ניתן להבטיח חסינות מלאה מפני גישה בלתי מורשית.
            </p>
          </section>

          <section>
            <h2 className="font-heebo text-xl font-black text-[#182e86]">עיון, תיקון ומחיקה</h2>
            <p>
              ניתן לפנות אלינו בבקשה לעיין במידע שנשמר, לתקנו או לבקש את מחיקתו,
              בכפוף להוראות הדין ולחובות שמירת מידע החלות עלינו.
            </p>
          </section>

          <section>
            <h2 className="font-heebo text-xl font-black text-[#182e86]">יצירת קשר</h2>
            <p>
              לשאלות או לבקשות בנושא פרטיות ניתן לפנות בטלפון{" "}
              <a className="font-bold text-[#182e86] underline" href="tel:0543024343">
                054-302-4343
              </a>{" "}
              או בדוא״ל{" "}
              <a className="font-bold text-[#182e86] underline" href="mailto:info@kaytanot.co.il">
                info@kaytanot.co.il
              </a>
              .
            </p>
          </section>
        </div>

        <a
          href="/kaytana/mitgalgalim"
          className="mt-9 inline-flex rounded-xl bg-[#182e86] px-6 py-3 font-black text-white transition-colors hover:bg-[#111f5c]"
        >
          חזרה לעמוד הקייטנה
        </a>
      </article>
    </div>
  );
}
