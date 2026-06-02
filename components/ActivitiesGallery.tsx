"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ActivityItem { name: string; image: string }

interface Props {
  items: ActivityItem[];
}

export default function ActivitiesGallery({ items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "right" | "left") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Arrow right */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition -mr-4"
        aria-label="הקודם"
      >
        <ChevronRight className="w-5 h-5 text-[#182e86]" />
      </button>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-52 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={`${item.name} - קייטנת מתגלגלים ונהנים`}
              className="w-full h-36 object-cover"
              loading="lazy"
            />
            <div className="px-3 py-3 text-center">
              <p className="font-black text-gray-900 text-base">{item.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow left */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition -ml-4"
        aria-label="הבא"
      >
        <ChevronLeft className="w-5 h-5 text-[#182e86]" />
      </button>
    </div>
  );
}
