"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ActivityItem { name: string; image: string }

interface Props {
  items: ActivityItem[];
}

function getActivityText(item: ActivityItem) {
  const isArtistShow = item.name.includes("מופע") && (item.name.includes("אמנים") || item.name.includes("אומנים"));
  const isLunaPark = item.name.includes("לונה");
  const isCinema = item.name.includes("קולנוע");

  if (isArtistShow) {
    return { title: "מופעי כוכבי רשת", subtitle: "" };
  }

  if (isLunaPark) {
    return { title: "לונה פארק / סופרלנד", subtitle: "" };
  }

  if (isCinema) {
    return { title: "חוויה קולנועית", subtitle: "" };
  }

  return { title: item.name, subtitle: "" };
}

export default function ActivitiesGallery({ items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "right" | "left") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-10 -mr-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:bg-gray-50"
        aria-label="הקודם"
      >
        <ChevronRight className="h-5 w-5 text-[#182e86]" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth px-2 pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, i) => {
          const text = getActivityText(item);

          return (
            <div
              key={i}
              className="w-52 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <img
                src={item.image}
                alt={`${item.name} - קייטנת מתגלגלים ונהנים`}
                className="h-36 w-full object-cover"
                loading="lazy"
              />
              <div className="px-3 py-3 text-center">
                <p className="font-heebo text-base font-black text-slate-900">{text.title}</p>
                {text.subtitle && <p className="mt-1 text-sm font-semibold leading-5 text-slate-600">{text.subtitle}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 z-10 -ml-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:bg-gray-50"
        aria-label="הבא"
      >
        <ChevronLeft className="h-5 w-5 text-[#182e86]" />
      </button>
    </div>
  );
}
