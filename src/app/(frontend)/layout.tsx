import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display face. Tighter and more editorial than the body grotesque, so headings
// read as headings rather than large body text.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abdalla.futuresolve.net"),
  title: {
    default: "Abdalla Mostafa — Senior Software Engineer",
    template: "%s — Abdalla Mostafa",
  },
  description:
    "Senior Software Engineer building scalable web platforms, process automation, and payment integrations that help businesses run smoother.",
  keywords: [
    "Abdalla Mostafa",
    "Software Engineer",
    "Backend Developer",
    "Next.js",
    "Node.js",
    "Payment Integration",
    "Process Automation",
  ],
  authors: [{ name: "Abdalla Mostafa" }],
  openGraph: {
    title: "Abdalla Mostafa — Senior Software Engineer",
    description:
      "Senior Software Engineer building scalable web platforms, process automation, and payment integrations.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdalla Mostafa — Senior Software Engineer",
    description:
      "Senior Software Engineer building scalable web platforms, process automation, and payment integrations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Scroll reveals are driven by IntersectionObserver. With scripts
            disabled that never fires, so force every section visible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
