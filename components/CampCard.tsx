import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Check } from "lucide-react";

interface Camp {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  city: string;
  age_min: number;
  age_max: number;
  image_url: string | null;
  price_basic: number | null;
}

const DEFAULT_BULLETS = [
  "ימי פנאי מגוונים",
  "צוות מקצועי ומנוסה",
  "סביבה בטוחה ומפוקחת",
];

export default function CampCard({ camp }: { camp: Camp }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-[#e0e8f0] flex flex-col">
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-[#003087] to-[#1a4aa8] overflow-hidden flex-shrink-0">
        {camp.image_url ? (
          <Image
            src={camp.image_url}
            alt={camp.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
            🏕️
          </div>
        )}
        {/* Price badge */}
        {camp.price_basic && (
          <div className="absolute top-3 left-3 bg-[#F5C400] text-[#003087] font-bold text-xs px-3 py-1.5 rounded-full">
            החל מ-{camp.price_basic.toLocaleString("he-IL")} ₪
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-extrabold text-xl text-[#003087] mb-1 leading-tight">{camp.name}</h3>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#003087]" />
            {camp.city}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#003087]" />
            גילאי {camp.age_min}-{camp.age_max}
          </span>
        </div>

        {camp.description && (
          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{camp.description}</p>
        )}

        {/* Bullets */}
        <ul className="space-y-1.5 mb-5 flex-1">
          {DEFAULT_BULLETS.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-green-600" strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>

        <Link
          href={`/kaytana/${camp.slug}`}
          className="block w-full text-center bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-bold py-3 rounded-full transition-colors text-sm"
        >
          לפרטים והרשמה »
        </Link>
      </div>
    </div>
  );
}
