import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/lib/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      locale: "he_IL",
      url: `https://www.kaytanot.co.il/blog/${post.slug}`,
      images: [{ url: post.image, alt: post.title }],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <div className="bg-[#f5f8fc] px-4 py-10">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#dfe7f2] bg-white shadow-xl shadow-[#003087]/10">
        <div className="relative h-72 md:h-96">
          <Image src={post.image} alt={post.title} fill sizes="100vw" className="object-cover" priority />
        </div>
        <div className="p-6 md:p-10">
          <span className="rounded-full bg-[#f6f8fc] px-3 py-1 text-xs font-black text-[#182e86]">
            {post.category}
          </span>
          <h1 className="mt-4 font-rubik text-4xl font-black leading-tight text-[#182e86] md:text-5xl">
            {post.title}
          </h1>
          <div className="my-5 h-1 w-14 rounded-full bg-[#F5C400]" />
          <p className="text-sm font-bold text-slate-400">{post.readTime}</p>
          <p className="mt-5 text-xl font-bold leading-9 text-slate-800">{post.description}</p>

          <div className="mt-8 space-y-8">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-heebo text-3xl font-black text-[#182e86]">{section.heading}</h2>
                <div className="mt-3 space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-lg leading-9 text-slate-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>

      <section className="mx-auto mt-8 max-w-4xl rounded-3xl border border-[#dfe7f2] bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-heebo text-3xl font-black text-[#182e86]">עוד מדריכים להורים</h2>
        <div className="mt-5 grid gap-3">
          {related.map((item) => (
            <Link key={item.slug} href={`/blog/${item.slug}`} className="rounded-2xl bg-[#f6f8fc] p-4 font-bold text-[#182e86] hover:bg-[#eef3fb]">
              {item.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
