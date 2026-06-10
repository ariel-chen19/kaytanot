"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
  links?: { label: string; href?: string }[];
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-[#e0e8f0] rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-right bg-white hover:bg-[#F5F7FA] transition-colors"
          >
            <span className="font-heebo font-bold text-[#003087] text-base leading-snug">
              {item.q}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-[#003087] flex-shrink-0 transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-4 bg-[#F5F7FA] border-t border-[#e0e8f0]">
              <p className="text-slate-600 text-[15px] leading-7 pt-3">{item.a}</p>
              {item.links && item.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.links.map((link) => (
                    link.href ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-xl bg-[#003087] px-4 py-2 text-sm font-black text-white transition-colors hover:bg-[#001f5b]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <span
                        key={link.label}
                        className="inline-flex cursor-default items-center justify-center rounded-xl bg-[#003087] px-4 py-2 text-sm font-black text-white"
                      >
                        {link.label}
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
