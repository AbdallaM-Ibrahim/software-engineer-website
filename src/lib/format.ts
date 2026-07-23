// Small presentation helpers shared across sections.

export function formatMonthYear(date?: string | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function dateRange(
  from?: string | null,
  to?: string | null,
  isPresent?: boolean,
): string {
  const start = formatMonthYear(from);
  const end = isPresent ? "Present" : formatMonthYear(to);
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
