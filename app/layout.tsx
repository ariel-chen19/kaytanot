import type { Metadata } from "next";
import { Assistant, Heebo, Rubik } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ANALYTICS_CONSENT_KEY } from "@/lib/analytics";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  weight: ["400", "500", "700", "800", "900"],
});

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
  weight: ["700", "800", "900"],
});

const siteUrl = "https://www.kaytanot.co.il";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:  "קייטנות — כל הקייטנות במקום אחד",
    template: "%s | קייטנות",
  },
  description: "מוצאים, משווים ונרשמים לקייטנה המתאימה ביותר לילדים שלכם. כל הקייטנות בישראל במקום אחד.",
  keywords: ["קייטנות", "קיץ 2026", "קייטנת קיץ", "קייטנה לילדים", "קייטנת ספורט", "קייטנת שחייה"],
  openGraph: {
    type:        "website",
    locale:      "he_IL",
    url:         siteUrl,
    siteName:    "קייטנות",
    title:       "קייטנות — כל הקייטנות במקום אחד",
    description: "מוצאים, משווים ונרשמים לקייטנה המתאימה ביותר לילדים שלכם.",
    images: [{ url: "/kaytanot_logo.webp", width: 800, height: 400, alt: "קייטנות" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "קייטנות — כל הקייטנות במקום אחד",
    description: "מוצאים, משווים ונרשמים לקייטנה המתאימה ביותר לילדים שלכם.",
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${heebo.variable} ${rubik.variable}`}>
      <head>
        <script
          id="google-consent-default"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              var analyticsConsent = 'denied';
              try {
                analyticsConsent =
                  window.localStorage.getItem('${ANALYTICS_CONSENT_KEY}') === 'granted'
                    ? 'granted'
                    : 'denied';
              } catch (error) {}
              gtag('consent', 'default', {
                analytics_storage: analyticsConsent,
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-assistant">
        <SiteChrome>{children}</SiteChrome>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
