"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  image: string;
  alt: string;
}

interface Props {
  items: GalleryItem[];
}

export default function ExperienceGalleryCarousel({ items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "right" | "left") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -720 : 720, behavior: "smooth" });
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
        {items.map((item) => (
          <div
            key={item.image}
            className="w-[78%] flex-shrink-0 overflow-hidden rounded-2xl border border-[#e7edf5] bg-white shadow-sm sm:w-[46%] md:w-[300px] lg:w-[320px]"
          >
            <img
              src={item.image}
              alt={item.alt}
              className="h-40 w-full object-cover md:h-44"
              loading="lazy"
            />
          </div>
        ))}
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
