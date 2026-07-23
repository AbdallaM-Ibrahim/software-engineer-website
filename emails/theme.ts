import { pixelBasedPreset, type TailwindConfig } from "react-email";

// Hex equivalents of the site's oklch tokens in src/app/(frontend)/globals.css.
// Email clients have no oklch support, so the palette is converted once here and
// shared by both templates rather than re-typed per file.
export const brand = {
  /** --primary: oklch(0.5 0.1 185) */
  primary: "#0d7d82",
  primaryDark: "#0a6165",
  /** --background */
  page: "#f5f6f7",
  card: "#ffffff",
  /** --foreground */
  text: "#22262b",
  /** --muted-foreground */
  muted: "#6b7280",
  /** --border */
  border: "#e4e6e9",
  /** --accent */
  accent: "#eaf4f4",
} as const;

// pixelBasedPreset is required: email clients don't resolve `rem`, so Tailwind's
// default rem-based spacing scale would collapse.
export const emailTailwindConfig: TailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        brand: brand.primary,
        "brand-dark": brand.primaryDark,
        page: brand.page,
        card: brand.card,
        ink: brand.text,
        muted: brand.muted,
        line: brand.border,
        accent: brand.accent,
      },
      fontFamily: {
        sans: ["Geist", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["Geist Mono", "SFMono-Regular", "Consolas", "monospace"],
      },
    },
  },
};
