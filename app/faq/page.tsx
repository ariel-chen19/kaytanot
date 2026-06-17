import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "שאלות נפוצות",
  description: "שאלות ותשובות להורים ולבעלי קייטנות באתר קייטנות.",
  alternates: { canonical: "/faq" },
};

const questions = [
  ["האם קייטנות מפעילה את הקייטנות?", "לא. האתר מרכז מידע ומחבר בין הורים למפעילי קייטנות. כל קייטנה מופעלת על ידי הגוף שמופיע בעמוד שלה."],
  ["איך משאירים פרטים?", "נכנסים לעמוד הקייטנה, ממלאים שם וטלפון, והפנייה נשמרת במערכת ומועברת לגורם הרלוונטי."],
  ["האם המחירים סופיים?", "המחירים מוצגים לפי המידע שנמסר לנו. ייתכנו הטבות, סבסודים או שינויים לפי עיר, מחזור, ארגון או ועד עובדים."],
  ["איך בעל קייטנה יכול לפרסם?", "דרך עמוד יצירת קייטנה ניתן למלא פרטים, להוסיף מלל, לוגו, תמונות, מחזורים ושאלות נפוצות. לאחר בדיקה ניתן לפרסם את העמוד."],
  ["האם יש הטבות למשפחות?", "כן, האתר מרכז אזור הטבות ועדכונים למשפחות. חלק מההטבות דורשות בדיקת זכאות מול ארגון או ספק."],
];

export default function FaqPage() {
  return (
    <div className="bg-[#f5f8fc] px-4 py-10">
      <main className="mx-auto max-w-4xl rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-xl shadow-[#003087]/10 md:p-10">
        <h1 className="font-heebo text-4xl font-black text-[#182e86]">שאלות נפוצות</h1>
        <div className="mt-3 h-1 w-12 rounded-full bg-[#F5C400]" />
        <div className="mt-8 space-y-3">
          {questions.map(([q, a]) => (
            <details key={q} className="rounded-2xl bg-[#f6f8fc] p-5">
              <summary className="cursor-pointer list-none font-heebo text-xl font-black text-[#182e86]">
                {q}
              </summary>
              <p className="mt-3 leading-8 text-slate-700">{a}</p>
            </details>
          ))}
        </div>
      </main>
    </div>
  );
}
