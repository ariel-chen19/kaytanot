import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";

const infoLinks = [
  { href: "/", label: "דף הבית" },
  { href: "/search", label: "קייטנות 2026" },
  { href: "/benefits", label: "הטבות למשפחות" },
  { href: "/about", label: "אודות" },
  { href: "/blog", label: "בלוג" },
  { href: "/faq", label: "שאלות נפוצות" },
];

const legalLinks = [
  { href: "/terms", label: "תקנון אתר" },
  { href: "/privacy", label: "מדיניות פרטיות" },
];

export default function Footer() {
  return (
    <footer className="bg-[#001f5b] text-white">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5C400] text-xl font-black text-[#003087]">
                ק
              </div>
              <span className="text-xl font-extrabold">קייטנות</span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-blue-200">
              פלטפורמה ישראלית למציאת קייטנות, השארת פרטים וקבלת מידע ברור להורים במקום אחד.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-base font-bold text-[#F5C400]">מידע</h3>
            <ul className="space-y-2.5">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-200 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-bold text-[#F5C400]">מסמכים</h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-200 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-bold text-[#F5C400]">צור קשר</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-blue-200">
                <MessageCircle className="h-4 w-4 flex-shrink-0 text-[#F5C400]" />
                <a
                  href="https://wa.me/972559999139"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  055-999-9139
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-blue-200">
                <Mail className="h-4 w-4 flex-shrink-0 text-[#F5C400]" />
                <a href="mailto:info@kaytanot.co.il" className="transition-colors hover:text-white">
                  info@kaytanot.co.il
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-200">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#F5C400]" />
                <span>ישראל</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-blue-300 sm:flex-row">
          <p>© {new Date().getFullYear()} קייטנות - כל הזכויות שמורות</p>
          <p>נבנה בישראל</p>
        </div>
      </div>
    </footer>
  );
}
