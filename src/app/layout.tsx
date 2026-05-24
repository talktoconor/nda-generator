import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AnalyticsScripts } from "@/components/analytics";
import { UtmCapture } from "@/components/utm-capture";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NDA Generator — Professional NDAs in Minutes",
  description:
    "Create legally-sound Non-Disclosure Agreements instantly. No lawyer needed. Mutual or unilateral NDAs customized to your needs for just $29.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="NDANow Blog" href="/feed.xml" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
        <AnalyticsScripts />
        <UtmCapture />
      </body>
    </html>
  );
}
