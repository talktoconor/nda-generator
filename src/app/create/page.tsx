"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { NdaData, NdaType } from "@/lib/nda-template";
import { trackCheckoutStart } from "@/components/conversion-events";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

function todayString() {
  return new Date().toISOString().split("T")[0];
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getTierPricing(tier: string | null): { label: string; displayPrice: string; buttonPrice: string; amountCents: number } {
  if (tier === "pro" || tier === "biz") {
    return { label: tier === "pro" ? "Pro" : "Business", displayPrice: "$59.00", buttonPrice: "$59", amountCents: 5900 };
  }
  return { label: "Basic", displayPrice: "$29.00", buttonPrice: "$29", amountCents: 2900 };
}

const defaultFormData: NdaData = {
  ndaType: "mutual",
  disclosingPartyName: "",
  disclosingPartyEmail: "",
  disclosingPartyAddress: "",
  receivingPartyName: "",
  receivingPartyEmail: "",
  receivingPartyAddress: "",
  purpose: "",
  durationYears: 2,
  governingState: "Delaware",
  effectiveDate: todayString(),
};

function CreateContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier");
  const pricing = getTierPricing(tier);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<NdaData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ndanow_draft");
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return defaultFormData;
  });

  useEffect(() => {
    localStorage.setItem("ndanow_draft", JSON.stringify(form));
  }, [form]);

  function update(field: keyof NdaData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function canAdvance() {
    if (step === 1) return true;
    if (step === 2)
      return form.disclosingPartyName && isValidEmail(form.disclosingPartyEmail) && form.disclosingPartyAddress;
    if (step === 3)
      return form.receivingPartyName && isValidEmail(form.receivingPartyEmail) && form.receivingPartyAddress;
    if (step === 4) return form.purpose;
    return true;
  }

  async function handleCheckout() {
    setLoading(true);
    setError("");
    trackCheckoutStart(form.ndaType);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tier: tier || "basic" }),
      });
      const data = await res.json();
      if (data.url) {
        localStorage.removeItem("ndanow_draft");
        window.location.href = data.url;
      } else {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight"
          >
            NDA<span className="text-blue-600">Now</span>
          </Link>
          <span className="text-sm text-gray-400">
            Step {step} of 5
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-6 py-12">
        <div className="mb-8">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">NDA Type</h2>
            <p className="text-gray-500 text-sm mb-8">
              Choose the type of NDA you need.
            </p>
            <div className="space-y-3">
              {(["mutual", "unilateral"] as NdaType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => update("ndaType", type)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    form.ndaType === type
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium capitalize">{type} NDA</span>
                  <p className="text-sm text-gray-500 mt-1">
                    {type === "mutual"
                      ? "Both parties share confidential information with each other."
                      : "Only one party discloses confidential information to the other."}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {form.ndaType === "mutual"
                ? "Party A"
                : "Disclosing Party"}
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              {form.ndaType === "mutual"
                ? "The first party to the agreement."
                : "The party sharing confidential information."}
            </p>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  Full legal name
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Acme Corporation"
                  value={form.disclosingPartyName}
                  onChange={(e) =>
                    update("disclosingPartyName", e.target.value)
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Email address</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="alice@acme.com"
                  value={form.disclosingPartyEmail}
                  onChange={(e) =>
                    update("disclosingPartyEmail", e.target.value)
                  }
                />
                <p className="text-xs text-gray-400 mt-1">
                  The NDA will be sent here for e-signature.
                </p>
                {form.disclosingPartyEmail && !isValidEmail(form.disclosingPartyEmail) && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter a valid email address
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="123 Main St, Suite 100, City, State 12345"
                  value={form.disclosingPartyAddress}
                  onChange={(e) =>
                    update("disclosingPartyAddress", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {form.ndaType === "mutual"
                ? "Party B"
                : "Receiving Party"}
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              {form.ndaType === "mutual"
                ? "The second party to the agreement."
                : "The party receiving confidential information."}
            </p>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  Full legal name
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Beta Industries LLC"
                  value={form.receivingPartyName}
                  onChange={(e) =>
                    update("receivingPartyName", e.target.value)
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Email address</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="bob@beta.com"
                  value={form.receivingPartyEmail}
                  onChange={(e) =>
                    update("receivingPartyEmail", e.target.value)
                  }
                />
                <p className="text-xs text-gray-400 mt-1">
                  The NDA will be sent here for e-signature.
                </p>
                {form.receivingPartyEmail && !isValidEmail(form.receivingPartyEmail) && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter a valid email address
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="456 Oak Ave, City, State 67890"
                  value={form.receivingPartyAddress}
                  onChange={(e) =>
                    update("receivingPartyAddress", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Agreement Terms</h2>
            <p className="text-gray-500 text-sm mb-8">
              Define the scope and terms of your NDA.
            </p>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  Purpose of disclosure
                </label>
                <textarea
                  className={inputClass + " h-24 resize-none"}
                  placeholder="e.g., Evaluating a potential business partnership for software development"
                  value={form.purpose}
                  onChange={(e) => update("purpose", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Effective date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.effectiveDate}
                  onChange={(e) =>
                    update("effectiveDate", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Duration (years)
                  </label>
                  <select
                    className={inputClass}
                    value={form.durationYears}
                    onChange={(e) =>
                      update("durationYears", Number(e.target.value))
                    }
                  >
                    {[1, 2, 3, 5].map((y) => (
                      <option key={y} value={y}>
                        {y} year{y > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Governing state
                  </label>
                  <select
                    className={inputClass}
                    value={form.governingState}
                    onChange={(e) =>
                      update("governingState", e.target.value)
                    }
                  >
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Review &amp; Pay</h2>
            <p className="text-gray-500 text-sm mb-8">
              Confirm your NDA details, then proceed to payment.
            </p>
            <div className="bg-gray-50 rounded-lg p-5 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium capitalize">
                  {form.ndaType} NDA
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {form.ndaType === "mutual"
                    ? "Party A"
                    : "Disclosing Party"}
                </span>
                <span className="font-medium">
                  {form.disclosingPartyName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {form.ndaType === "mutual"
                    ? "Party B"
                    : "Receiving Party"}
                </span>
                <span className="font-medium">
                  {form.receivingPartyName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">
                  {form.durationYears} year
                  {form.durationYears > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Governing law</span>
                <span className="font-medium">{form.governingState}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Effective date</span>
                <span className="font-medium">{form.effectiveDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Plan</span>
                <span className="font-medium">{pricing.label}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-blue-600">{pricing.displayPrice}</span>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              &larr; Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              disabled={!canAdvance()}
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue &rarr;
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleCheckout}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Redirecting..." : `Pay ${pricing.buttonPrice} & Send for Signing`}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-full flex items-center justify-center">
          <div className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CreateContent />
    </Suspense>
  );
}
