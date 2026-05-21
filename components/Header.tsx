"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const { auth } = supabase;
    auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: "דף הבית" },
    { href: "/search", label: "קייטנות" },
    { href: "/about", label: "אודות" },
    { href: "/faq", label: "שאלות נפוצות" },
    { href: "/blog", label: "בלוג" },
    { href: "/#contact", label: "צור קשר" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Right (RTL start): Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kaytanot_logo.webp" alt="קייטנות" style={{ height: "80px", width: "auto" }} />
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#003087] hover:text-[#F5C400] transition-colors font-medium text-sm px-3 py-2 rounded-lg hover:bg-[#003087]/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Left (RTL end): Phone + WhatsApp + Login */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <a
            href="tel:050XXXXXXX"
            className="flex items-center gap-1.5 text-[#003087] text-sm font-medium hover:text-[#F5C400] transition-colors"
          >
            <Phone className="w-4 h-4" />
            050-XXXXXXX
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/972500000000"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.867-2.031-.967-.272-.099-.47-.148-.669.15-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-[#003087]/80 hover:text-[#003087] text-sm font-medium px-3 py-2"
              >
                לוח הבקרה
              </Link>
              <button
                onClick={handleLogout}
                className="text-[#003087]/60 hover:text-[#003087] text-sm px-3 py-2"
              >
                התנתק
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-[#003087] hover:bg-[#002060] text-white font-bold text-sm px-5 py-2 rounded-full transition-colors"
            >
              התחברות
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-[#003087]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="תפריט"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-[#003087]/10 px-4 py-5 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#003087] hover:text-[#F5C400] font-medium py-2.5 border-b border-[#003087]/10 last:border-0"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4">
            <a href="tel:050XXXXXXX" className="flex items-center justify-center gap-2 py-2.5 text-[#003087] font-medium">
              <Phone className="w-4 h-4" />
              050-XXXXXXX
            </a>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2.5 rounded-full border border-[#003087]/30 text-[#003087] font-medium"
                >
                  לוח הבקרה
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-center py-2.5 rounded-full bg-[#003087]/10 text-[#003087] font-medium"
                >
                  התנתק
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="text-center py-2.5 rounded-full bg-[#003087] text-white font-bold"
              >
                התחברות
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
