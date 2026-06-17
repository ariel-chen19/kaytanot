"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "דף הבית" },
  { href: "/search", label: "קייטנות" },
  { href: "/benefits", label: "הטבות למשפחות" },
  { href: "/about", label: "אודות" },
  { href: "/faq", label: "שאלות נפוצות" },
  { href: "/blog", label: "בלוג" },
  { href: "/#contact", label: "צור קשר" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between gap-6 px-6">
        <nav className="hidden items-center gap-0 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-5 text-sm font-medium transition-colors ${
                  isActive ? "text-[#003087]" : "text-gray-600 hover:text-[#003087]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#003087]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden flex-shrink-0 items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 shadow-sm lg:flex">
          <a
            href="https://wa.me/972559999139"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#003087]"
          >
            <MessageCircle className="h-4 w-4" />
            055-999-9139
          </a>

          <div className="mx-1 h-5 w-px bg-gray-200" />

          <a
            href="https://wa.me/972559999139"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500 transition-colors hover:bg-green-600"
          >
            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.867-2.031-.967-.272-.099-.47-.148-.669.15-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>
        </div>

        <button
          className="mr-auto p-2 text-[#003087] lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="תפריט"
          type="button"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-gray-100 bg-white px-4 py-5 shadow-lg lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-gray-100 py-2.5 font-medium text-[#003087] last:border-0 hover:text-[#F5C400]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4">
            <a
              href="https://wa.me/972559999139"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 font-medium text-[#003087]"
            >
              <MessageCircle className="h-4 w-4" />
              055-999-9139
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
