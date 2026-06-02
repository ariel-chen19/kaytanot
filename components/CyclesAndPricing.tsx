"use client";

import { useState } from "react";
import { Calendar, Clock, CheckCircle, MapPin, ArrowLeft } from "lucide-react";

interface Cycle { label: string; dates: string; days: string; hours: string }
interface CityPrice { city: string; price: number }

interface Props {
  cycles: Cycle[];
  cityPrices?: CityPrice[] | null;
  priceBasic?: number | null;
}

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
      {/* City selector */}
      {hasCityPrices && (
        <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
          <label className="flex items-center gap-2 text-sm font-bold text-[#182e86] mb-3">
            <MapPin className="w-4 h-4 text-[#F5C400]" />
            בחרו עיר לראות מחיר מדויק
          </label>
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium bg-white focus:outline-none focus:border-[#182e86] text-base"
          >
            {cityPrices!.map(cp => (
              <option key={cp.city} value={cp.city}>{cp.city}</option>
            ))}
          </select>
          {selectedCity && (
            <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              המחירים מעודכנים עבור: {selectedCity}
            </p>
          )}
        </div>
      )}

      {/* Cycles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cycles.map((cycle, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <span className="inline-block bg-[#182e86] text-white text-sm font-black px-4 py-1.5 rounded-full self-start">
              {cycle.label}
            </span>

            <ul className="space-y-2.5">
              {cycle.dates && (
                <li className="flex items-center gap-2 text-gray-900 font-semibold text-base">
                  <Calendar className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                  {cycle.dates}
                </li>
              )}
              {cycle.days && (
                <li className="flex items-center gap-2 text-gray-900">
                  <CheckCircle className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                  {cycle.days}
                </li>
              )}
              {cycle.hours && (
                <li className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {cycle.hours}
                </li>
              )}
            </ul>

            {/* Price */}
            {currentPrice && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 mb-0.5">מחיר למחזור</p>
                <p className="text-3xl font-black text-[#182e86]">
                  ₪ {currentPrice.toLocaleString("he-IL")}
                  {hasCityPrices && selectedCity && (
                    <span className="text-sm font-medium text-gray-400 mr-2">ב{selectedCity}</span>
                  )}
                </p>
              </div>
            )}

            <a
              href="#contact-form"
              className="mt-auto flex items-center justify-center gap-2 bg-[#F5C400] hover:bg-[#e0b200] text-[#182e86] font-black py-3 rounded-xl transition-colors text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              להרשמה
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
