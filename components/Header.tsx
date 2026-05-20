"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
    { href: "/search", label: "קייטנות 2026" },
    { href: "/search?type=programs", label: "תכנים ומסלולים" },
    { href: "/publish", label: "פרסם קייטנה" },
    { href: "/#contact", label: "צור קשר" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#003087] shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-[#F5C400] rounded-full w-9 h-9 flex items-center justify-center text-[#003087] font-black text-lg">
            ק
          </div>
          <span className="font-extrabold text-lg text-white hidden sm:block">קייטנות</span>
        </Link>

        {/* Desktop Nav — centered */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/90 hover:text-[#F5C400] transition-colors font-medium text-sm px-3 py-2 rounded-lg hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth / CTA */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-white/80 hover:text-white text-sm font-medium px-3 py-2"
              >
                לוח הבקרה
              </Link>
              <button
                onClick={handleLogout}
                className="text-white/70 hover:text-white text-sm px-3 py-2"
              >
                התנתק
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-white/80 hover:text-white text-sm font-medium px-3 py-2"
              >
                כניסה
              </Link>
              <Link
                href="/publish"
                className="bg-[#F5C400] hover:bg-[#e0b200] text-[#003087] font-bold text-sm px-5 py-2 rounded-full transition-colors"
              >
                להרשמה עכשיו
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="תפריט"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-[#001f5b] border-t border-white/10 px-4 py-5 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/90 hover:text-[#F5C400] font-medium py-2.5 border-b border-white/10 last:border-0"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2.5 rounded-full border border-white/30 text-white font-medium"
                >
                  לוח הבקרה
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-center py-2.5 rounded-full bg-white/10 text-white font-medium"
                >
                  התנתק
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2.5 rounded-full border border-white/30 text-white font-medium"
                >
                  כניסה
                </Link>
                <Link
                  href="/publish"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2.5 rounded-full bg-[#F5C400] text-[#003087] font-bold"
                >
                  להרשמה עכשיו
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
