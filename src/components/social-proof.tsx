"use client";

import { useState, useEffect } from "react";

export function SocialProofCounter() {
  const [count, setCount] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/track")
      .then((res) => res.json())
      .then((data) => setCount(data.formatted))
      .catch(() => setCount("800+"));
  }, []);

  if (!count) return null;

  return (
    <p className="mt-6 text-sm text-gray-400 flex items-center gap-2">
      <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      {count} NDAs generated
    </p>
  );
}

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center gap-4 mt-8 text-xs text-gray-400">
      <span className="flex items-center gap-1.5">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        SSL Secured
      </span>
      <span className="flex items-center gap-1.5">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        30-Day Money Back
      </span>
      <span className="flex items-center gap-1.5">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Legally Sound
      </span>
    </div>
  );
}
