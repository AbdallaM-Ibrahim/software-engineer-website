// Small presentation helpers shared across sections.

// Arabic month names and numerals come from the same Intl call, so the date
// format follows the page language without a second code path. `ar-EG` rather
// than plain `ar` keeps Gregorian months, which is what a CV reader expects.
const DATE_LOCALES: Record<string, string> = {
  en: "en-US",
  ar: "ar-EG",
};

export function formatMonthYear(date?: string | null, locale = "en"): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(DATE_LOCALES[locale] ?? "en-US", {
    month: "short",
    year: "numeric",
  });
}

export function dateRange(
  from?: string | null,
  to?: string | null,
  isPresent?: boolean,
  { locale = "en", presentLabel = "Present" } = {},
): string {
  const start = formatMonthYear(from, locale);
  const end = isPresent ? presentLabel : formatMonthYear(to, locale);
  if (!start && !end) return "";
  return `${start} — ${end}`;
}

// Textareas store one item per line; render them as list entries.
export function toLines(text?: string | null): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean);
}

// Split a bio blob into paragraphs on blank lines.
export function toParagraphs(text?: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function initials(name?: string | null): string {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
