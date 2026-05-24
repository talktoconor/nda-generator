"use client";

import { useState } from "react";
import Link from "next/link";

interface CheckerResult {
  overall: "strong" | "moderate" | "weak";
  score: number;
  factors: { label: string; status: "good" | "warning" | "bad"; note: string }[];
  recommendation: string;
}

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const STRICT_STATES = ["California", "Montana", "North Dakota", "Oklahoma"];
const STRONG_STATES = ["Delaware", "New York", "Texas", "Florida", "Illinois", "Georgia", "Virginia", "Massachusetts"];

function analyzeEnforceability(state: string, duration: string, scope: string, consideration: string, hasExclusions: boolean): CheckerResult {
  const factors: CheckerResult["factors"] = [];
  let score = 70; // baseline

  // State analysis
  if (STRICT_STATES.includes(state)) {
    factors.push({
      label: "Jurisdiction",
      status: "warning",
      note: `${state} applies strict scrutiny to NDAs. Courts may narrow overly broad terms, but well-drafted NDAs are still enforceable.`,
    });
    score -= 10;
  } else if (STRONG_STATES.includes(state)) {
    factors.push({
      label: "Jurisdiction",
      status: "good",
      note: `${state} has strong NDA enforcement precedent. Courts generally uphold reasonable confidentiality agreements.`,
    });
    score += 10;
  } else {
    factors.push({
      label: "Jurisdiction",
      status: "good",
      note: `${state} follows standard NDA enforcement principles under the Uniform Trade Secrets Act.`,
    });
    score += 5;
  }

  // Duration analysis
  const durationYears = parseInt(duration);
  if (durationYears <= 2) {
    factors.push({
      label: "Duration",
      status: "good",
      note: `${duration}-year term is within the standard range and unlikely to be challenged as unreasonable.`,
    });
    score += 10;
  } else if (durationYears <= 5) {
    factors.push({
      label: "Duration",
      status: "good",
      note: `${duration}-year term is common for business NDAs. Most courts find terms up to 5 years reasonable.`,
    });
    score += 5;
  } else if (duration === "indefinite") {
    factors.push({
      label: "Duration",
      status: "warning",
      note: "Indefinite duration NDAs face more scrutiny. Some courts may limit enforceability. Consider a specific term with a survival period.",
    });
    score -= 15;
  } else {
    factors.push({
      label: "Duration",
      status: "warning",
      note: `A ${duration}-year term may be considered excessive. Courts prefer terms of 2-5 years for most business contexts.`,
    });
    score -= 10;
  }

  // Scope analysis
  if (scope === "narrow") {
    factors.push({
      label: "Scope",
      status: "good",
      note: "Narrowly defined confidential information is strongly enforceable. Courts favor specificity.",
    });
    score += 10;
  } else if (scope === "moderate") {
    factors.push({
      label: "Scope",
      status: "good",
      note: "Moderately defined scope with clear categories of confidential information. This is the standard approach.",
    });
    score += 5;
  } else {
    factors.push({
      label: "Scope",
      status: "warning",
      note: "Overly broad scope (e.g., 'all information shared') may be challenged. Define specific categories of confidential information.",
    });
    score -= 10;
  }

  // Consideration
  if (consideration === "employment" || consideration === "business") {
    factors.push({
      label: "Consideration",
      status: "good",
      note: consideration === "employment"
        ? "Employment or continued employment provides adequate consideration in most states."
        : "A business relationship or mutual exchange of information provides strong consideration.",
    });
    score += 5;
  } else if (consideration === "none") {
    factors.push({
      label: "Consideration",
      status: "bad",
      note: "Without adequate consideration, the NDA may not be enforceable. Ensure both parties receive something of value.",
    });
    score -= 20;
  } else {
    factors.push({
      label: "Consideration",
      status: "good",
      note: "Payment or other tangible consideration strengthens enforceability.",
    });
    score += 10;
  }

  // Exclusions
  if (hasExclusions) {
    factors.push({
      label: "Standard Exclusions",
      status: "good",
      note: "Including standard exclusions (public info, prior knowledge, independent development) strengthens enforceability and demonstrates reasonableness.",
    });
    score += 5;
  } else {
    factors.push({
      label: "Standard Exclusions",
      status: "warning",
      note: "Missing standard exclusions may make the NDA appear overbroad. Add exclusions for publicly available info, prior knowledge, and court-ordered disclosures.",
    });
    score -= 10;
  }

  // Clamp score
  score = Math.max(20, Math.min(95, score));

  const overall: CheckerResult["overall"] = score >= 75 ? "strong" : score >= 50 ? "moderate" : "weak";

  const recommendations: Record<string, string> = {
    strong: "Your NDA terms appear well-structured for enforceability. Generate a professional NDA with these terms to ensure all required clauses are included.",
    moderate: "Your NDA has some areas that could be strengthened. Consider narrowing the scope, adjusting the duration, or adding standard exclusions to improve enforceability.",
    weak: "Your NDA terms have significant enforceability concerns. We recommend reviewing the flagged issues and adjusting your terms before finalizing the agreement.",
  };

  return { overall, score, factors, recommendation: recommendations[overall] };
}

const statusColors = {
  good: { bg: "bg-green-50", text: "text-green-700", icon: "text-green-500" },
  warning: { bg: "bg-yellow-50", text: "text-yellow-700", icon: "text-yellow-500" },
  bad: { bg: "bg-red-50", text: "text-red-700", icon: "text-red-500" },
};

const overallColors = {
  strong: { bg: "bg-green-100", text: "text-green-800", ring: "ring-green-500" },
  moderate: { bg: "bg-yellow-100", text: "text-yellow-800", ring: "ring-yellow-500" },
  weak: { bg: "bg-red-100", text: "text-red-800", ring: "ring-red-500" },
};

export default function EnforceabilityChecker() {
  const [state, setState] = useState("");
  const [duration, setDuration] = useState("2");
  const [scope, setScope] = useState("moderate");
  const [consideration, setConsideration] = useState("business");
  const [hasExclusions, setHasExclusions] = useState(true);
  const [result, setResult] = useState<CheckerResult | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state) return;
    setResult(analyzeEnforceability(state, duration, scope, consideration, hasExclusions));
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
  const selectClass =
    "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            NDA<span className="text-blue-600">Now</span>
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/tools" className="text-gray-500 hover:text-gray-900">Tools</Link>
            <Link href="/create" className="font-medium text-blue-600 hover:text-blue-700">Create NDA &rarr;</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        <div className="mb-3">
          <Link href="/tools" className="text-sm text-gray-400 hover:text-gray-600">&larr; All Tools</Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">NDA Enforceability Checker</h1>
        <p className="text-gray-500 mb-8">
          Enter your NDA terms below to get an instant assessment of enforceability in your state. Free, no signup required.
        </p>

        <form onSubmit={handleCheck} className="space-y-5 mb-10">
          <div>
            <label className={labelClass}>State / Jurisdiction</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className={selectClass} required>
              <option value="">Select a state...</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>NDA Duration</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className={selectClass}>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="5">5 years</option>
              <option value="7">7 years</option>
              <option value="10">10 years</option>
              <option value="indefinite">Indefinite / Perpetual</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Scope of Confidential Information</label>
            <select value={scope} onChange={(e) => setScope(e.target.value)} className={selectClass}>
              <option value="narrow">Narrow &mdash; Specific categories defined</option>
              <option value="moderate">Moderate &mdash; General categories with examples</option>
              <option value="broad">Broad &mdash; &quot;All information shared&quot;</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Consideration (What does the receiving party get?)</label>
            <select value={consideration} onChange={(e) => setConsideration(e.target.value)} className={selectClass}>
              <option value="business">Business opportunity / Partnership discussion</option>
              <option value="employment">Employment or continued employment</option>
              <option value="payment">Direct payment</option>
              <option value="none">No specific consideration</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="exclusions"
              checked={hasExclusions}
              onChange={(e) => setHasExclusions(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="exclusions" className="text-sm text-gray-700">
              Includes standard exclusions (public info, prior knowledge, independent development)
            </label>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Check Enforceability
          </button>
        </form>

        {result && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Score header */}
            <div className={`${overallColors[result.overall].bg} px-6 py-5`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Enforceability Assessment</p>
                  <p className={`text-2xl font-bold ${overallColors[result.overall].text}`}>
                    {result.overall === "strong" ? "Strong" : result.overall === "moderate" ? "Moderate" : "Weak"} Enforceability
                  </p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ring-4 ${overallColors[result.overall].ring} bg-white`}>
                  <span className={`text-xl font-bold ${overallColors[result.overall].text}`}>{result.score}</span>
                </div>
              </div>
            </div>

            {/* Factors */}
            <div className="px-6 py-5 space-y-3">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Analysis</h3>
              {result.factors.map((factor) => (
                <div key={factor.label} className={`${statusColors[factor.status].bg} rounded-lg p-4`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${statusColors[factor.status].icon}`}>
                      {factor.status === "good" ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : factor.status === "warning" ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${statusColors[factor.status].text}`}>{factor.label}</p>
                      <p className="text-sm text-gray-600 mt-1">{factor.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">Recommendation</h3>
              <p className="text-sm text-gray-700">{result.recommendation}</p>
            </div>

            {/* CTA */}
            <div className="px-6 py-5 border-t border-gray-100">
              <Link
                href="/create"
                className="block w-full text-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate an Enforceable NDA &mdash; $29
              </Link>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Our NDAs include all recommended clauses, standard exclusions, and state-specific optimizations.
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 text-xs text-gray-400 border-t border-gray-100 pt-6">
          <p>
            <strong>Disclaimer:</strong> This tool provides general information about NDA enforceability factors and is not legal advice.
            Enforceability depends on many factors including specific language, context, and judicial interpretation.
            Consult a licensed attorney for legal advice about your specific situation.
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 text-sm text-gray-400">
          <p>NDANow provides document templates for informational purposes only and does not constitute legal advice.</p>
        </div>
      </footer>
    </div>
  );
}
