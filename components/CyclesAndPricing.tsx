"use client";

import { Calendar, Clock, ArrowLeft } from "lucide-react";

interface Cycle { label: string; dates: string; days: string; hours: string }

interface Props {
  cycles: Cycle[];
  priceBasic?: number | null;
  priceLabel?: string;
}

const CARD_COLORS = [
  { badge: "bg-[#182e86]", btn: "bg-[#182e86] hover:bg-[#111f5c]", price: "text-[#182e86]" },
  { badge: "bg-emerald-600", btn: "bg-emerald-600 hover:bg-emerald-700", price: "text-emerald-600" },
  { badge: "bg-[#182e86]", btn: "bg-[#182e86] hover:bg-[#111f5c]", price: "text-[#182e86]" },
  { badge: "bg-emerald-600", btn: "bg-emerald-600 hover:bg-emerald-700", price: "text-emerald-600" },
];

export default function CyclesAndPricing({ cycles, priceBasic, priceLabel }: Props) {
  return (
    <div>
      {/* Cycle cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cycles.map((cycle, i) => {
          const color = CARD_COLORS[i % CARD_COLORS.length];
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 items-center text-center">

              {/* Badge — bigger */}
              <span className={`inline-block ${color.badge} text-white text-[15px] font-black px-5 py-2 rounded-full`}>
                {cycle.label}
              </span>

              {/* Dates — large */}
              {cycle.dates && (
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="font-heebo text-2xl font-black text-slate-900">{cycle.dates}</span>
                </div>
              )}

              {/* Days + Hours inline */}
              <div className="flex items-center justify-center gap-4 text-[15px] text-slate-700">
                {cycle.days && <span className="font-medium">{cycle.days}</span>}
                {cycle.days && cycle.hours && <span className="text-gray-300">|</span>}
                {cycle.hours && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {cycle.hours}
                  </span>
                )}
              </div>

              {/* Price */}
              {priceBasic && (
                <div>
                  <span className={`font-heebo text-4xl font-black ${color.price}`}>
                    {priceLabel ?? `₪ ${priceBasic.toLocaleString("he-IL")}`}
                  </span>
                </div>
              )}

              {/* CTA */}
              <a
                href="#contact-form-bottom"
                className={`w-full flex items-center justify-center gap-2 ${color.btn} text-white font-black py-3.5 rounded-xl transition-colors text-base mt-auto`}
              >
                <ArrowLeft className="w-4 h-4" />
                לפרטים נוספים והרשמה
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
