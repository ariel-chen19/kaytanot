"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { ANALYTICS_CONSENT_KEY, GA_MEASUREMENT_ID } from "@/lib/analytics";

type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function updateGoogleConsent(choice: ConsentChoice) {
  window.gtag?.("consent", "update", {
    analytics_storage: choice,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export default function GoogleAnalytics() {
  const [ready, setReady] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const savedConsent = window.localStorage.getItem(ANALYTICS_CONSENT_KEY) as ConsentChoice | null;

    if (savedConsent === "granted" || savedConsent === "denied") {
      setAnalyticsEnabled(savedConsent === "granted");
      updateGoogleConsent(savedConsent);
    } else {
      setBannerOpen(true);
    }

    setReady(true);
  }, []);

  const saveConsent = (choice: ConsentChoice) => {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
    setAnalyticsEnabled(choice === "granted");
    updateGoogleConsent(choice);
    setBannerOpen(false);
    setSettingsOpen(false);
  };

  const saveSettings = () => {
    saveConsent(analyticsEnabled ? "granted" : "denied");
  };

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true
          });
        `}
      </Script>

      {ready && bannerOpen && !settingsOpen && (
        <aside
          className="fixed inset-x-3 bottom-4 z-[80] mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 text-right shadow-2xl md:flex md:items-center md:gap-5 md:p-5"
          role="dialog"
          aria-label="הגדרות פרטיות"
        >
          <div className="flex-1">
            <p className="font-heebo text-lg font-black text-[#003087]">הגדרות פרטיות</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              אנחנו משתמשים בקובצי Cookie חיוניים להפעלת האתר, ובאישורכם גם ב-Google Analytics כדי להבין מה עובד טוב יותר ולשפר את השירות. לא נפעיל עוגיות פרסום בשלב הזה.
              {" "}
              <a href="/privacy" className="font-bold text-[#003087] underline">
                למדיניות הפרטיות
              </a>
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 md:mt-0 md:w-[430px] md:shrink-0">
            <button
              type="button"
              onClick={() => saveConsent("granted")}
              className="rounded-xl bg-[#003087] px-5 py-3 font-black text-white transition hover:bg-[#001f5c]"
            >
              אישור
            </button>
            <button
              type="button"
              onClick={() => saveConsent("denied")}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-[#003087] transition hover:bg-slate-50"
            >
              דחייה
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-[#003087] transition hover:bg-slate-50"
            >
              הגדרות
            </button>
          </div>
        </aside>
      )}

      {ready && settingsOpen && (
        <aside
          className="fixed inset-x-3 bottom-4 z-[90] mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-2xl"
          role="dialog"
          aria-label="ניהול העדפות פרטיות"
        >
          <div className="mb-5">
            <p className="font-heebo text-xl font-black text-[#003087]">ניהול העדפות פרטיות</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              אפשר לבחור אילו שימושים לאפשר. קובצי Cookie חיוניים נשארים פעילים כדי שהאתר יעבוד בצורה תקינה.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
              <div>
                <p className="font-black text-[#003087]">חיוניים</p>
                <p className="mt-1 text-sm text-slate-600">נדרשים להפעלת האתר, אבטחה ושמירת בחירת פרטיות.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">תמיד פעיל</span>
            </div>

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
              <div>
                <p className="font-black text-[#003087]">אנליטיקס</p>
                <p className="mt-1 text-sm text-slate-600">עוזר לנו למדוד ביקורים, להבין אילו עמודים שימושיים ולשפר את האתר.</p>
              </div>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                className="h-6 w-6 accent-[#003087]"
              />
            </label>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 opacity-70">
              <div>
                <p className="font-black text-[#003087]">שיווק ופרסום</p>
                <p className="mt-1 text-sm text-slate-600">כרגע לא מופעלים באתר פיקסלים או עוגיות פרסום.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">כבוי</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={saveSettings}
              className="rounded-xl bg-[#003087] px-5 py-3 font-black text-white transition hover:bg-[#001f5c]"
            >
              שמירת הגדרות
            </button>
            <button
              type="button"
              onClick={() => saveConsent("granted")}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-[#003087] transition hover:bg-slate-50"
            >
              אשר הכל
            </button>
            <button
              type="button"
              onClick={() => saveConsent("denied")}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-[#003087] transition hover:bg-slate-50"
            >
              דחה הכל
            </button>
          </div>
        </aside>
      )}

      {ready && !bannerOpen && !settingsOpen && (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="fixed bottom-4 left-3 z-[60] rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#003087] shadow-md transition hover:bg-slate-50"
        >
          הגדרות פרטיות
        </button>
      )}
    </>
  );
}
