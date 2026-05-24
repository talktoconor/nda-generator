"use client";

import { useEffect } from "react";
import { captureUtmParams } from "@/lib/utm";

/** Client component that captures UTM params on page load */
export function UtmCapture() {
  useEffect(() => {
    captureUtmParams();
  }, []);

  return null;
}
