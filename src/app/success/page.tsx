"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";
import { generateNdaText, type NdaData } from "@/lib/nda-template";
import { trackPurchase } from "@/components/conversion-events";
import { getStoredUtmParams } from "@/lib/utm";

type Status = "loading" | "sending" | "sent" | "error";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<Status>("loading");
  const [ndaData, setNdaData] = useState<NdaData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const sendForSigning = useCallback(
    async (data: NdaData, sid: string) => {
      setStatus("sending");
      try {
        const res = await fetch("/api/send-nda", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ndaData: data, sessionId: sid }),
        });
        if (res.ok) {
          setStatus("sent");
        } else {
          // SignWell might not be configured — still show PDF download
          setErrorMsg("e-signature");
          setStatus("sent");
        }
      } catch {
        setErrorMsg("e-signature");
        setStatus("sent");
      }
    },
    []
  );

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    fetch(`/api/checkout?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.paid && data.ndaData) {
          setNdaData(data.ndaData);
          sendForSigning(data.ndaData, sessionId);

          // Fire conversion events
          trackPurchase(29);

          // Send server-side attribution
          const utm = getStoredUtmParams();
          fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "purchase",
              value: 29,
              nda_type: data.ndaData.ndaType,
              ...utm,
              timestamp: new Date().toISOString(),
            }),
          }).catch(() => {}); // non-blocking
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId, sendForSigning]);

  function downloadPdf() {
    if (!ndaData) return;

    const text = generateNdaText(ndaData);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 5.5;

    doc.setFont("helvetica");
    let y = 25;

    const lines = text.split("\n");

    for (const line of lines) {
      if (
        line === "NON-DISCLOSURE AGREEMENT" ||
        line ===
          "IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date."
      ) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        const wrapped = doc.splitTextToSize(line, maxWidth);
        for (const wl of wrapped) {
          if (y > 275) {
            doc.addPage();
            y = 25;
          }
          doc.text(wl, margin, y);
          y += lineHeight + 1;
        }
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        y += 2;
      } else if (/^\d+\./.test(line)) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        const wrapped = doc.splitTextToSize(line, maxWidth);
        for (const wl of wrapped) {
          if (y > 275) {
            doc.addPage();
            y = 25;
          }
          doc.text(wl, margin, y);
          y += lineHeight;
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        y += 1;
      } else if (line.trim() === "") {
        y += 3;
      } else {
        const wrapped = doc.splitTextToSize(line, maxWidth);
        for (const wl of wrapped) {
          if (y > 275) {
            doc.addPage();
            y = 25;
          }
          doc.text(wl, margin, y);
          y += lineHeight;
        }
      }
    }

    const filename = `NDA_${ndaData.disclosingPartyName.replace(/\s+/g, "_")}_${ndaData.receivingPartyName.replace(/\s+/g, "_")}.pdf`;
    doc.save(filename);
  }

  if (status === "loading" || status === "sending") {
    return (
      <div className="text-center py-24">
        <div className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-500">
          {status === "loading"
            ? "Verifying payment..."
            : "Sending NDA for e-signature..."}
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-24 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-3">Something went wrong</h2>
        <p className="text-gray-500 mb-6">
          We couldn&apos;t verify your payment. If you were charged, please
          contact support.
        </p>
        <Link
          href="/create"
          className="text-blue-600 font-medium hover:text-blue-700"
        >
          &larr; Try again
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-24 max-w-md mx-auto">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {errorMsg === "e-signature" ? (
        <>
          <h2 className="text-2xl font-bold mb-3">Your NDA is ready</h2>
          <p className="text-gray-500 mb-8">
            Payment confirmed. Download your NDA below.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-3">NDA sent for signing</h2>
          <p className="text-gray-500 mb-2">
            Both parties will receive an email with a link to sign the NDA
            electronically.
          </p>
          {ndaData && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-left mb-8 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Sent to</span>
                <span className="font-medium">
                  {ndaData.disclosingPartyEmail}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">and</span>
                <span className="font-medium">
                  {ndaData.receivingPartyEmail}
                </span>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-400 mb-6">
            You can also download an unsigned copy for your records.
          </p>
        </>
      )}

      <button
        onClick={downloadPdf}
        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Download PDF
      </button>
      <div className="mt-6">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          Create another NDA
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight"
          >
            NDA<span className="text-blue-600">Now</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-xl mx-auto w-full px-6">
        <Suspense
          fallback={
            <div className="text-center py-24">
              <div className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
