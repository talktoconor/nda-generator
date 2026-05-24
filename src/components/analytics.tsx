// ── Analytics and tracking scripts ──
// Privacy-friendly Plausible analytics + conversion tracking pixels
// All scripts are loaded conditionally based on environment variables

import Script from "next/script";

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** Plausible Analytics — privacy-friendly, no cookie banner needed */
export function PlausibleScript() {
  if (!PLAUSIBLE_DOMAIN) return null;
  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}

/** Google Ads / GA4 — gtag.js for conversion tracking */
export function GtagScript() {
  if (!GTAG_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GTAG_ID}');
        `}
      </Script>
    </>
  );
}

/** Meta Pixel for Facebook/Instagram ad tracking */
export function MetaPixelScript() {
  if (!META_PIXEL_ID) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}

/** All analytics scripts combined */
export function AnalyticsScripts() {
  return (
    <>
      <PlausibleScript />
      <GtagScript />
      <MetaPixelScript />
    </>
  );
}
