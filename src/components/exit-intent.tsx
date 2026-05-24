"use client";

import { useState, useEffect, useCallback } from "react";

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExit = useCallback(() => {
    // Don't show if already dismissed or on create/success pages
    if (sessionStorage.getItem("exit_popup_shown")) return;
    if (window.location.pathname.startsWith("/create")) return;
    if (window.location.pathname.startsWith("/success")) return;

    sessionStorage.setItem("exit_popup_shown", "1");
    setShow(true);
  }, []);

  useEffect(() => {
    // Exit intent: mouse leaves viewport (desktop only)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        handleExit();
      }
    };

    // Mobile: scroll up quickly or idle timeout
    let scrollTimeout: NodeJS.Timeout | undefined;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };

    // Show after 45 seconds if user hasn't converted
    const idleTimeout = setTimeout(() => {
      handleExit();
    }, 45000);

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(idleTimeout);
      clearTimeout(scrollTimeout);
    };
  }, [handleExit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      // Still show success — we don't want to frustrate
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShow(false)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!submitted ? (
          <>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Wait! Get 15% off.
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Enter your email and we&apos;ll send you an exclusive discount
              code to use at checkout. No spam, just savings.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? "Sending..." : "Send My Discount Code"}
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Code expires in 48 hours. One per customer.
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Check your inbox!</h2>
            <p className="text-gray-600 text-sm mb-4">
              We&apos;ve sent your 15% discount code to <strong>{email}</strong>.
            </p>
            <button
              onClick={() => setShow(false)}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Got it, thanks!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
