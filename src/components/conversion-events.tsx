"use client";

// ── Client-side conversion event helpers ──
// Fire conversion events for Google Ads and Meta Pixel

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    plausible?: (...args: unknown[]) => void;
  }
}

/** Track a purchase conversion across all platforms */
export function trackPurchase(value: number, currency = "USD") {
  // Google Ads conversion
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: process.env.NEXT_PUBLIC_GADS_CONVERSION_ID,
      value,
      currency,
    });
    window.gtag("event", "purchase", { value, currency });
  }

  // Meta Pixel purchase
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", { value, currency });
  }

  // Plausible custom event
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible("Purchase", { props: { value: String(value) } });
  }
}

/** Track checkout initiation */
export function trackCheckoutStart(ndaType: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "begin_checkout", { items: [{ item_name: `NDA - ${ndaType}` }] });
  }

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout");
  }

  if (typeof window !== "undefined" && window.plausible) {
    window.plausible("CheckoutStart", { props: { nda_type: ndaType } });
  }
}

/** Track CTA click */
export function trackCtaClick(location: string) {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible("CTAClick", { props: { location } });
  }

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "cta_click", { event_label: location });
  }
}

/** Track NDA type selection */
export function trackNdaTypeSelected(ndaType: string) {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible("NDATypeSelected", { props: { nda_type: ndaType } });
  }

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "select_item", { items: [{ item_name: ndaType }] });
  }
}
