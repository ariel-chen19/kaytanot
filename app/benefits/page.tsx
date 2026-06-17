import type { Metadata } from "next";
import BenefitsPageClient from "./BenefitsPageClient";

export const metadata: Metadata = {
  title: "הטבות למשפחות",
  description:
    "הטבות וקופונים למשפחות באתר קייטנות: אטרקציות, בריכות, הצגות, מסעדות, קייטנות וחופשות במחירים נוחים.",
  alternates: {
    canonical: "/benefits",
  },
  openGraph: {
    title: "הטבות למשפחות | קייטנות",
    description:
      "עוזרים לכם לעבור את החופש בכיף, עם הטבות וחוויות למשפחות במחירים שפויים.",
    url: "https://www.kaytanot.co.il/benefits",
    siteName: "קייטנות",
    locale: "he_IL",
    type: "website",
  },
};

export default function BenefitsPage() {
  return <BenefitsPageClient />;
}
