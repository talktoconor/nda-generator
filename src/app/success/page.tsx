"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";
import { generateNdaText, type NdaData } from "@/lib/nda-template";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [ndaData, setNdaData] = useState<NdaData | null>(null);

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
          setStatus("ready");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

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
        line === "IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date."
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

  if (status === "loading") {
    return (
      <div className="text-center py-24">
        <div className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-500">Verifying payment...</p>
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
      <h2 className="text-2xl font-bold mb-3">Your NDA is ready</h2>
      <p className="text-gray-500 mb-8">
        Payment confirmed. Download your customized NDA below.
      </p>
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
