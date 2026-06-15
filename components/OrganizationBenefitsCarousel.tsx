"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const ORGANIZATIONS = [
  { name: "חבר", file: "hever-logo.webp" },
  { name: "קרנות הסוהרים", file: "prison-officers-fund-logo.webp" },
  { name: "טוב פלוס", file: "tov-plus-logo.webp" },
  { name: "בהצדעה", file: "behatsdaa-consumer-club-logo.webp" },
  { name: "מועדון שלך", file: "yours-consumer-club-logo.webp" },
  { name: "בנק לאומי", file: "bank-leumi-logo.webp" },
  { name: "הבנק הבינלאומי", file: "first-international-bank-logo.webp" },
  { name: "בנק הפועלים", file: "bank-hapoalim-logo.webp" },
  { name: "מזרחי טפחות", file: "mizrahi-tefahot-logo.webp" },
  { name: "בנק מרכנתיל", file: "mercantile-logo.webp" },
  { name: "בנק דיסקונט", file: "discount-logo.webp" },
  { name: "אשמורת", file: "ashmoret-logo.webp" },
  { name: "מועדון הוט", file: "hot-logo.webp" },
  { name: "ארגון המורים", file: "israel-teachers-union-logo.webp" },
  { name: "הסתדרות העובדים", file: "histadrut-logo.webp" },
  { name: "שירות בתי הסוהר", file: "israel-prison-service-logo.webp" },
  { name: "המרכז הרפואי איכילוב", file: "ichilov-medical-center-logo.webp" },
  { name: "רשות שדות התעופה", file: "iaa-logo.webp" },
  { name: "קצא\"א", file: "eapc-israel-logo.webp" },
  { name: "שיכון ובינוי", file: "shikun-binui-logo.webp" },
  { name: "דן תחבורה ציבורית", file: "dan-logo.webp" },
  { name: "סלקום", file: "cellcom-logo.webp" },
  { name: "מועדון נכון", file: "nachon-logo.webp" },
];

const whatsappMessage =
  "היי, אני רוצה לבדוק זכאות להטבה ואופן הרשמה לקייטנת מתגלגלים ונהנים.";
const whatsappHref = `https://wa.me/972543024343?text=${encodeURIComponent(whatsappMessage)}`;

function LogoGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="organization-logo-group" aria-hidden={hidden || undefined}>
      {ORGANIZATIONS.map((organization) => (
        <div className="organization-logo-card" key={`${hidden ? "copy-" : ""}${organization.file}`}>
          <Image
            src={`/logo/${organization.file}`}
            alt={hidden ? "" : `לוגו ${organization.name} - הטבות לקייטנת מתגלגלים ונהנים`}
            width={150}
            height={76}
            className="h-[68px] w-[138px] object-contain"
          />
        </div>
      ))}
    </div>
  );
}

export default function OrganizationBenefitsCarousel() {
  return (
    <section
      id="organization-benefits"
      className="overflow-hidden rounded-3xl border border-[#dfe7f2] bg-white py-6 shadow-sm md:py-8"
    >
      <div className="px-6 md:px-8">
        <h2 className="mb-1 font-heebo text-3xl font-black text-[#182e86]">
          הטבות לעובדי חברות וארגונים
        </h2>
        <div className="mb-3 h-1 w-10 rounded-full bg-[#F5C400]" />
        <p className="max-w-3xl text-base leading-7 text-slate-700">
          עובדים בחברה או חברים בארגון שבהסדר? ייתכן שמגיעה לכם הטבה או השתתפות במחיר הקייטנה.
        </p>
      </div>

      <div className="organization-logo-marquee my-6" dir="ltr">
        <div className="organization-logo-track">
          <LogoGroup />
          <LogoGroup hidden />
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 px-6 md:px-8">
        <p className="text-sm font-semibold text-slate-500">
          ההטבות ותנאי ההרשמה משתנים בין החברות והארגונים.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("benefits_whatsapp_click", {
              camp_name: "mitgalgalim",
              link_location: "organization_benefits",
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#182e86] px-6 py-3 text-base font-black text-white transition-colors hover:bg-[#111f5c]"
        >
          <MessageCircle className="h-5 w-5" />
          לבירור זכאות ואופן הרשמה
        </a>
      </div>
    </section>
  );
}
