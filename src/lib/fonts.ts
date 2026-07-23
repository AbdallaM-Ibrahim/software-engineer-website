import {
  Geist,
  Geist_Mono,
  Instrument_Sans,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";

// next/font must be initialised at module scope, so the faces live here and
// both root layouts (English and Arabic) pull from the same place.

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display face. Tighter and more editorial than the body grotesque, so headings
// read as headings rather than large body text.
export const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["600", "700"],
});

// Geist has no Arabic glyphs — without this the Arabic pages fall back to
// whatever the OS supplies, which is a different face on every device.
export const arabicSans = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic-sans",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const LATIN_FONT_VARIABLES = [
  geistSans.variable,
  geistMono.variable,
  instrumentSans.variable,
].join(" ");

export const ARABIC_FONT_VARIABLES = [
  LATIN_FONT_VARIABLES,
  arabicSans.variable,
].join(" ");
