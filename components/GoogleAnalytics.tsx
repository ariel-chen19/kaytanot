"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT_KEY,
  GA_MEASUREMENT_ID,
} from "@/lib/analytics";

type ConsentChoice = "granted" | "denied" | null;

export default function GoogleAnalytics() {
  const [consent, setConsent] = useState<ConsentChoice>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedConsent = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    if (savedConsent === "granted" || savedConsent === "denied") {
      setConsent(savedConsent);
    } else {
      setShowSettings(true);
    }
  }, []);

  const saveConsent = (choice: Exclude<ConsentChoice, null>) => {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
    setConsent(choice);
    setShowSettings(false);
  };

  return (
    <>
      {consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('consent', 'default', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
              gtag('config', '${GA_MEASUREMENT_ID}', {
                anonymize_ip: true
              });
            `}
          </Script>
        </>
      )}

      {showSettings ? (
        <aside
          className="fixed inset-x-3 bottom-24 z-[70] mx-auto max-w-3xl rounded-2xl border border-[#dfe7f2] bg-white p-4 shadow-2xl md:bottom-5 md:flex md:items-center md:gap-5 md:p-5"
          role="dialog"
          aria-label="העדפות פרטיות"
        >
          <div className="flex-1">
            <p className="font-heebo text-lg font-black text-[#182e86]">
              מדידה ושיפור חוויית הגלישה
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              באישורכם נשתמש ב-Google Analytics כדי להבין אילו חלקים באתר
              מועילים ולשפר את השירות. לא נשתמש בעוגיות פרסום.
              {" "}
              <a className="font-bold text-[#182e86] underline" href="/privacy">
                מדיניות פרטיות
              </a>
            </p>
          </div>
          <div className="mt-4 flex gap-2 md:mt-0 md:flex-shrink-0">
            <button
              type="button"
              onClick={() => saveConsent("granted")}
              className="flex-1 rounded-xl bg-[#182e86] px-5 py-2.5 font-black text-white hover:bg-[#111f5c]"
            >
              מאשר/ת
            </button>
            <button
              type="button"
              onClick={() => saveConsent("denied")}
              className="flex-1 rounded-xl border border-[#cfd8e6] bg-white px-5 py-2.5 font-bold text-[#182e86] hover:bg-slate-50"
            >
              לא עכשיו
            </button>
          </div>
        </aside>
      ) : (
        <button
          type="button"
          onClick={() => setShowSettings(true)}
          className="fixed bottom-24 left-3 z-[60] rounded-lg border border-[#dfe7f2] bg-white px-3 py-2 text-xs font-bold text-[#182e86] shadow-md md:bottom-4"
        >
          הגדרות פרטיות
        </button>
      )}
    </>
  );
}
