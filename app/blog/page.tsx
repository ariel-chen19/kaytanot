import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "בלוג קייטנות",
  description: "מדריכים להורים על בחירת קייטנות, הסעות, מחירים, בטיחות והרשמה לקיץ.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <div className="bg-[#f5f8fc] px-4 py-10">
      <main className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-xl shadow-[#003087]/10 md:p-10">
          <p className="mb-2 text-sm font-black text-[#182e86]">מדריכים להורים</p>
          <h1 className="font-rubik text-4xl font-black text-[#182e86] md:text-5xl">בלוג קייטנות</h1>
          <div className="mb-5 mt-3 h-1 w-14 rounded-full bg-[#F5C400]" />
          <p className="max-w-3xl text-xl font-bold leading-9 text-slate-800">
            כל מה שכדאי לדעת לפני שבוחרים קייטנה: בטיחות, הסעות, מחירים, גילאים ושאלות חשובות.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="overflow-hidden rounded-3xl border border-[#dfe7f2] bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#003087]/10"
            >
              <div className="relative h-44">
                <Image src={post.image} alt={post.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="p-5">
                <span className="rounded-full bg-[#f6f8fc] px-3 py-1 text-xs font-black text-[#182e86]">
                  {post.category}
                </span>
                <h2 className="mt-4 font-heebo text-2xl font-black leading-tight text-[#182e86]">
                  {post.title}
                </h2>
                <p className="mt-3 leading-7 text-slate-600">{post.description}</p>
                <p className="mt-4 text-sm font-bold text-slate-400">{post.readTime}</p>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
