"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, CheckCircle, ArrowLeft } from "lucide-react";

interface Cycle { label: string; dates: string; days: string; hours: string }
interface CityPrice { city: string; price: number }

interface Props {
  cycles: Cycle[];
  cityPrices?: CityPrice[] | null;
  priceBasic?: number | null;
}

const CARD_COLORS = [
  { badge: "bg-[#182e86]", btn: "bg-[#182e86] hover:bg-[#111f5c]", price: "text-[#182e86]" },
  { badge: "bg-emerald-600",  btn: "bg-emerald-600 hover:bg-emerald-700",  price: "text-emerald-600"  },
  { badge: "bg-[#182e86]", btn: "bg-[#182e86] hover:bg-[#111f5c]", price: "text-[#182e86]" },
  { badge: "bg-emerald-600",  btn: "bg-emerald-600 hover:bg-emerald-700",  price: "text-emerald-600"  },
];

export default function CyclesAndPricing({ cycles, cityPrices, priceBasic }: Props) {
  const [selectedCity, setSelectedCity] = useState<string>(
    cityPrices && cityPrices.length > 0 ? cityPrices[0].city : ""
  );

  const currentPrice = cityPrices
    ? cityPrices.find(cp => cp.city === selectedCity)?.price
    : priceBasic;

  const hasCityPrices = cityPrices && cityPrices.length > 0;

  return (
    <div>
      {/* Subtitle */}
      {hasCityPrices && (
        <p className="text-gray-500 text-sm mb-5">
          המחיר משתנה לפי עיר ונקודת איסוף – בחרו עיר כדי לראות מחיר מדויק
        </p>
      )}

      {/* City selector */}
      {hasCityPrices && (
        <div className="border border-gray-200 rounded-2xl p-5 mb-6 bg-white shadow-sm">
          <label className="flex items-center justify-end gap-2 text-sm font-bold text-gray-700 mb-3">
            בחרו עיר
            <MapPin className="w-4 h-4 text-[#182e86]" />
          </label>
          <div className="relative">
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium bg-white focus:outline-none focus:border-[#182e86] text-base appearance-none"
              style={{ direction: "rtl" }}
            >
              {cityPrices!.map(cp => (
                <option key={cp.city} value={cp.city}>{cp.city}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              ▼
            </div>
          </div>
          {selectedCity && (
            <p className="mt-3 text-sm text-emerald-600 font-medium flex items-center justify-end gap-1.5">
              המחירים מעודכנים עבור: <span className="font-bold">{selectedCity}</span>
              <CheckCircle className="w-4 h-4" />
            </p>
          )}
        </div>
      )}

      {/* Dynamic city title */}
      {hasCityPrices && selectedCity && (
        <h3 className="text-lg font-black text-[#182e86] mb-4 text-right">
          המחירים בעיר {selectedCity}
        </h3>
      )}

      {/* Cycle cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cycles.map((cycle, i) => {
          const color = CARD_COLORS[i % CARD_COLORS.length];
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">

              {/* Badge */}
              <span className={`inline-block ${color.badge} text-white text-sm font-black px-4 py-1.5 rounded-full self-start`}>
                {cycle.label}
              </span>

              {/* Dates — large */}
              {cycle.dates && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-2xl font-black text-gray-900">{cycle.dates}</span>
                </div>
              )}

              {/* Days + Hours inline */}
              <div className="flex items-center gap-4 text-sm text-gray-700">
                {cycle.days && (
                  <span className="font-medium">{cycle.days}</span>
                )}
                {cycle.days && cycle.hours && <span className="text-gray-300">|</span>}
                {cycle.hours && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {cycle.hours}
                  </span>
                )}
              </div>

              {/* Price */}
              {currentPrice && (
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-black ${color.price}`}>
                    ₪ {currentPrice.toLocaleString("he-IL")}
                  </span>
                </div>
              )}

              {/* Dates detail box */}
              {cycle.dates && (
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">תאריכים</p>
                  <p className="font-bold text-gray-900 text-sm">{cycle.dates}</p>
                </div>
              )}

              {/* CTA */}
              <a
                href="#contact-form"
                className={`flex items-center justify-center gap-2 ${color.btn} text-white font-black py-3.5 rounded-xl transition-colors text-base mt-auto`}
              >
                <ArrowLeft className="w-4 h-4" />
                להרשמה
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
