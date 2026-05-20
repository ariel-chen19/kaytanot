"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CITIES = [
  "תל אביב", "ירושלים", "חיפה", "ראשון לציון", "פתח תקווה",
  "אשדוד", "נתניה", "באר שבע", "בני ברק", "הוד השרון",
  "רמת גן", "בת ים", "אשקלון", "רחובות", "לוד",
  "מודיעין", "הרצליה", "כפר סבא", "רעננה", "עפולה",
];

export default function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (age) params.set("age", age);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 w-full max-w-lg">
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 h-12 rounded-full border-2 border-white/30 bg-white/10 text-white placeholder:text-white/60 px-4 text-sm focus:outline-none focus:border-[#F5C400] backdrop-blur-sm"
        style={{ colorScheme: "dark" }}
      >
        <option value="" className="text-[#003087]">בחר עיר</option>
        {CITIES.map((c) => (
          <option key={c} value={c} className="text-[#003087]">{c}</option>
        ))}
      </select>

      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="גיל הילד"
        min={3}
        max={18}
        className="w-full sm:w-28 h-12 rounded-full border-2 border-white/30 bg-white/10 text-white placeholder:text-white/60 px-4 text-sm focus:outline-none focus:border-[#F5C400] backdrop-blur-sm"
      />

      <button
        type="submit"
        className="h-12 px-7 rounded-full bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-bold text-sm transition-colors flex-shrink-0"
      >
        חפש קייטנה
      </button>
    </form>
  );
}
