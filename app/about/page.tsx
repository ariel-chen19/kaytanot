import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "אודות קייטנות",
  description:
    "קייטנות הוא אתר שמרכז מידע, עמודי נחיתה ולידים לקייטנות בישראל, ומסייע להורים למצוא קייטנה שמתאימה לילדים.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="bg-[#f5f8fc] px-4 py-10">
      <main className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-xl shadow-[#003087]/10 md:p-10">
          <p className="mb-2 text-sm font-black text-[#182e86]">מי אנחנו</p>
          <h1 className="font-rubik text-4xl font-black leading-tight text-[#182e86] md:text-5xl">
            עושים סדר בעולם הקייטנות
          </h1>
          <div className="mb-6 mt-3 h-1 w-14 rounded-full bg-[#F5C400]" />
          <p className="max-w-3xl text-xl font-bold leading-9 text-slate-800">
            קייטנות נולד כדי לעזור להורים למצוא מידע ברור, אמין ונגיש על קייטנות,
            ולהעניק למפעילי קייטנות דרך מקצועית להציג את הפעילות שלהם ולקבל פניות איכותיות.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "מידע ברור", text: "עמודי קייטנה מסודרים עם גילאים, מחזורים, מחירים, פעילות ושאלות נפוצות." },
            { icon: HeartHandshake, title: "חיבור נכון", text: "הורה משאיר פרטים, ובעל הקייטנה מקבל ליד מסודר לטיפול מהיר." },
            { icon: Sparkles, title: "שפה אחידה", text: "כל עמוד נבנה במבנה שמדגיש אמון, חוויה, בטיחות וקריאה לפעולה." },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm">
              <Icon className="h-8 w-8 text-[#F5C400]" />
              <h2 className="mt-4 font-heebo text-2xl font-black text-[#182e86]">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:p-8">
          <h2 className="font-heebo text-3xl font-black text-[#182e86]">מה חשוב לנו</h2>
          <div className="mt-3 h-1 w-10 rounded-full bg-[#F5C400]" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "להציג להורים מידע קצר, ברור ולא עמוס.",
              "להדגיש בטיחות, ניסיון, צוות ותקנון לצד החוויה.",
              "לאפשר לבעלי קייטנות לקבל פניות בצורה מסודרת.",
              "לבנות אתר ישראלי, בעברית, שמרגיש פשוט ואמין.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-[#182e86]" />
                <p className="text-lg leading-8 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-[#182e86] p-6 text-white md:p-8">
          <h2 className="font-heebo text-3xl font-black">בעלי קייטנות?</h2>
          <p className="mt-3 max-w-2xl leading-8 text-blue-100">
            אפשר ליצור עמוד נחיתה לקייטנה, לקבל פניות ולנהל את המידע בצורה מסודרת.
          </p>
          <Link href="/publish" className="mt-5 inline-flex rounded-2xl bg-[#F5C400] px-6 py-3 font-black text-[#182e86]">
            יצירת עמוד קייטנה
          </Link>
        </section>
      </main>
    </div>
  );
}
