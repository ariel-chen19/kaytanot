import Link from "next/link";
import { MessageCircle, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#001f5b] text-white">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand + Social */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#F5C400] rounded-full w-10 h-10 flex items-center justify-center text-[#003087] font-black text-xl">
                ק
              </div>
              <span className="font-extrabold text-xl">קייטנות</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-6">
              הפלטפורמה המובילה לחיפוש ופרסום קייטנות בישראל — חינוך, ספורט, אמנות ועוד.
            </p>
            <div className="flex gap-3">
              {/* Facebook */}
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F5C400] hover:text-[#003087] flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F5C400] hover:text-[#003087] flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2 — Info */}
          <div>
            <h3 className="font-bold text-base mb-4 text-[#F5C400]">מידע</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "דף הבית" },
                { href: "/search", label: "קייטנות 2026" },
                { href: "/benefits", label: "הטבות למשפחות" },
                { href: "/about", label: "אודות" },
                { href: "/blog", label: "בלוג" },
                { href: "/search", label: "תכנים ומסלולים" },
                { href: "/publish", label: "פרסם קייטנה" },
                { href: "/dashboard", label: "אזור בעלי קייטנות" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-blue-200 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Quick links */}
          <div>
            <h3 className="font-bold text-base mb-4 text-[#F5C400]">ניווט מהיר</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/#camps", label: "קייטנות מובילות" },
                { href: "/#categories", label: "קטגוריות" },
                { href: "/#benefits", label: "למה אנחנו?" },
                { href: "/#contact", label: "צרו קשר" },
                { href: "/terms", label: "תקנון אתר" },
                { href: "/privacy", label: "מדיניות פרטיות" },
                { href: "/auth/register", label: "הרשמה" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-blue-200 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="font-bold text-base mb-4 text-[#F5C400]">צור קשר</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-blue-200 text-sm">
                <MessageCircle className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                <a
                  href="https://wa.me/972559999139"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  055-999-9139
                </a>
              </li>
              <li className="flex items-center gap-2 text-blue-200 text-sm">
                <Mail className="w-4 h-4 text-[#F5C400] flex-shrink-0" />
                <a href="mailto:info@kaytanot.co.il" className="hover:text-white transition-colors">
                  info@kaytanot.co.il
                </a>
              </li>
              <li className="flex items-start gap-2 text-blue-200 text-sm">
                <MapPin className="w-4 h-4 text-[#F5C400] flex-shrink-0 mt-0.5" />
                <span>ישראל</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-blue-300 text-xs">
          <p>© {new Date().getFullYear()} קייטנות – כל הזכויות שמורות</p>
          <p>עוצב ופותח בישראל 🇮🇱</p>
        </div>
      </div>
    </footer>
  );
}
