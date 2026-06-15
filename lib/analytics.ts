"use client";

export const GA_MEASUREMENT_ID = "G-2WCZ7R5JJD";
export const ANALYTICS_CONSENT_KEY = "kaytanot_analytics_consent";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (
    typeof window === "undefined" ||
    window.localStorage.getItem(ANALYTICS_CONSENT_KEY) !== "granted" ||
    !window.gtag
  ) {
    return;
  }

  window.gtag("event", name, params);
}
