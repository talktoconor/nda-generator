// ── UTM parameter utilities ──
// Capture, store, and retrieve UTM parameters for attribution tracking

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_page?: string;
  timestamp?: string;
}

const UTM_STORAGE_KEY = "ndanow_utm";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/** Capture UTM params from URL and store in sessionStorage */
export function captureUtmParams(): UtmParams | null {
  if (typeof window === "undefined") return null;

  const url = new URL(window.location.href);
  const params: UtmParams = {};
  let hasUtm = false;

  for (const key of UTM_KEYS) {
    const value = url.searchParams.get(key);
    if (value) {
      params[key] = value;
      hasUtm = true;
    }
  }

  // Always capture referrer and landing page on first visit
  if (!sessionStorage.getItem(UTM_STORAGE_KEY)) {
    params.referrer = document.referrer || "direct";
    params.landing_page = window.location.pathname;
    params.timestamp = new Date().toISOString();
  }

  if (hasUtm || !sessionStorage.getItem(UTM_STORAGE_KEY)) {
    // Merge with existing data (first-touch attribution)
    const existing = getStoredUtmParams();
    const merged = { ...existing, ...params };
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }

  return getStoredUtmParams();
}

/** Retrieve stored UTM params */
export function getStoredUtmParams(): UtmParams | null {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as UtmParams;
  } catch {
    return null;
  }
}

/** Clear stored UTM params (call after successful attribution) */
export function clearUtmParams() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(UTM_STORAGE_KEY);
}
