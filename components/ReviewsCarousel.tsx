"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface ReviewItem {
  id: string;
  source: "google" | "site" | "whatsapp" | "other";
  proof_type?: "google_review" | "manual_text" | "image_testimonial";
  author_name: string | null;
  author_city: string | null;
  rating: number | null;
  review_text?: string | null;
  body_text?: string | null;
  image_url?: string | null;
  review_date: string | null;
  review_url?: string | null;
  source_url?: string | null;
  source_label?: string | null;
}

interface Props {
  items: ReviewItem[];
}

function getSourceChip(item: ReviewItem) {
  if (item.source === "google") return "Google";
  if (item.source === "whatsapp") return "WhatsApp";
  if (item.source === "site") return "המלצה באתר";
  return item.source_label || "המלצה";
}

function getFooterLabel(item: ReviewItem) {
  if (item.source === "google") return "ביקורת מגוגל";
  if (item.source === "whatsapp") return "הודעת WhatsApp";
  if (item.source === "site") return "המלצה מהורה";
  return item.source_label || "המלצה מאומתת";
}

export default function ReviewsCarousel({ items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "right" | "left") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -760 : 760, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-10 -mr-4 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:bg-gray-50 md:flex"
        aria-label="הקודם"
      >
        <ChevronRight className="h-5 w-5 text-[#182e86]" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => {
          const reviewText = item.body_text ?? item.review_text ?? "";
          const sourceLink = item.source_url ?? item.review_url ?? null;
          const isImageCard = item.proof_type === "image_testimonial" && item.image_url;

          return (
            <article
              key={item.id}
              className={
                isImageCard
                  ? "flex w-[78%] flex-shrink-0 overflow-hidden rounded-2xl border border-[#e7edf5] bg-white p-2 shadow-sm sm:w-[44%] md:w-[285px]"
                  : "flex min-h-[290px] w-[88%] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-[#e7edf5] bg-white shadow-sm md:w-[calc((100%-2rem)/3)]"
              }
            >
              {isImageCard ? (
                <div className="relative aspect-square w-full overflow-hidden bg-white">
                  <img src={item.image_url!} alt={item.author_name || "המלצת הורים"} className="h-full w-full object-contain" loading="lazy" />
                </div>
              ) : (
                <div className="flex h-full flex-col p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-heebo text-lg font-black text-slate-950">{item.author_name || "הורה מאומת"}</p>
                      {item.author_city && <p className="text-sm text-slate-500">{item.author_city}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm tracking-[0.16em] text-[#F5C400]">
                        {"★".repeat(Math.max(1, Math.round(item.rating ?? 5)))}
                      </span>
                      <span className="rounded-full border border-[#dfe7f2] bg-[#f8fbff] px-2.5 py-1 text-[11px] font-bold text-[#182e86]">
                        {getSourceChip(item)}
                      </span>
                    </div>
                  </div>

                  <p className="mb-5 text-base leading-7 text-slate-800">{reviewText}</p>

                  <div className="mt-auto flex items-center justify-between border-t border-[#edf1f7] pt-4">
                    <div className="text-sm text-slate-500">
                      {item.review_date
                        ? new Date(item.review_date).toLocaleDateString("he-IL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : getFooterLabel(item)}
                    </div>
                    {sourceLink ? (
                      <a
                        href={sourceLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-bold text-[#4285F4] hover:underline"
                      >
                        לצפייה במקור
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-1 text-sm font-bold text-slate-500">
                        {item.source === "google" && <span className="text-[#4285F4]">G</span>}
                        <span>{getFooterLabel(item)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 z-10 -ml-4 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:bg-gray-50 md:flex"
        aria-label="הבא"
      >
        <ChevronLeft className="h-5 w-5 text-[#182e86]" />
      </button>
    </div>
  );
}
